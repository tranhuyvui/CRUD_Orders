const e = require('express');
const sql = require('../config/db');

async function getOrderByOrderID(req, res) {
    try {
        const OrderID = parseInt(req.params.OrderID);
        const result = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.OrderID = ${OrderID}
        `;


        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        
        }
        const order = result.recordset[0];
        
        if (req.user.Role !== 'Admin' && req.user.UserID !== order.UserID) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này!" });
        }
        const userInfo = await sql.query`
            SELECT UserID, FullName, Email, Address, Phone 
            FROM Users
            WHERE
                UserID = ${order.UserID}`;

        const formattedOrder = {
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            Status: getStatusOrder(order.Status),
            Product: {
                ProductID: order.ProductID,
                ProductName: order.ProductName,
                Quantity: order.Quantity
            },
            ShippingAddress: order.ShippingAddress,
            Phone: order.Phone
        };
        const resultUser = userInfo.recordset[0];
        return res.json({
            user: resultUser,
            order: formattedOrder
        });
    } catch (err) {
        res.status(500).send("Lỗiiii: " + err.message);
    }
}


async function getAllOrders(req, res) {
    try {
        if (req.user.Role === "Admin") {
            const result = await sql.query`
                SELECT u.FullName, u.Email, o.*, p.ProductName
                FROM Users u
                JOIN Orders o ON u.UserID = o.UserID
                JOIN Products p ON o.ProductID = p.ProductID
            `;
            if (result.recordset.length === 0) {
                return res.status(403).json({ message: "Hiện không có đơn hàng nào!" });
            }
            const userInfo = result.recordset.map(element => ({
                OrderID: element.OrderID,
                OrderDate: element.OrderDate,
                Status: getStatusOrder(element.Status),
                user: {
                    userID: element.UserID,
                    FullName: element.FullName,
                    Email: element.Email,
                    Phone: element.Phone,
                    ShippingAddress: element.Address
                },
                Product: {
                    ProductID: element.ProductID,
                    ProductName: element.ProductName,
                    Quantity: element.Quantity
                }
            }))

            return res.send(userInfo);
            
        } else {
            const userID = req.user.UserID;

            const ordersResult = await sql.query`
                SELECT o.*, p.ProductName
                FROM Orders o
                JOIN Products p ON o.ProductID = p.ProductID
                WHERE o.UserID = ${userID}
            `;

            if (ordersResult.recordset.length === 0) {
                return res.status(200).send({ message: "Bạn chưa có đơn hàng nào" });
            }

            const userInfo = await sql.query`
                SELECT  UserID, FullName, Email, Address, Phone
                FROM Users
                WHERE UserID = ${userID}
            `;

            const orderUser = ordersResult.recordset.map(element => ({
                OrderID: element.OrderID,
                OrderDate: element.OrderDate,
                Status: getStatusOrder(element.Status),
                Product: {
                    ProductID: element.ProductID,
                    ProductName: element.ProductName,
                    Quantity: element.Quantity
                },
                ShippingAddress: element.ShippingAddress,
                Phone: element.Phone
            }))
            const userInfoResult = userInfo.recordset[0];
            return res.json({
                user: userInfoResult,
                orders: orderUser
            });
        }
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addOrders(req, res) {
    try {
        const userIdFromClient = req.user.Role === "User" ? req.user.UserID : req.body.UserID

        const { ProductID, Quantity, ShippingAddress, Phone } = req.body;
        const UserID = userIdFromClient;

        const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (checkUser.recordset.length === 0) {
            return res.status(404).send("Không có User để thêm Orders");
        }

        if ((ShippingAddress && !Phone) || (!ShippingAddress && Phone)) {
            return res.status(400).send("Phải nhập cả địa chỉ và số điện thoại hoặc không nhập cả hai để lấy mặc định.");
        }
        let finalAddress = ShippingAddress;
        let finalPhone = Phone;
        const userInfo = checkUser.recordset[0];
        if (!Phone && !ShippingAddress) {
            finalAddress = userInfo.Address || "";  
            finalPhone = userInfo.Phone || "";
            if (!finalAddress || !finalPhone) {
                return res.status(400).send("Vui lòng cung cấp địa chỉ và số điện thoại hoặc cập nhật trong hồ sơ người dùng.");
            }
        }
        if (!userInfo.Phone || !userInfo.Address) {
            await sql.query`Update Users 
                SET Phone = ${Phone},
                    Address = ${ShippingAddress}
                WHERE UserID = ${UserID}`
        }

        const resultProduct = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
        if (resultProduct.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm với ProductID này!");
        }
        const curProduct = resultProduct.recordset[0];

        if (curProduct.Stock < Quantity) {
            return res.status(404).send(`số lượng đã vượt quá số lượng tồn kho ${curProduct.Stock}!`);
        }

        await sql.query`
            INSERT INTO Orders (UserID, ProductID, Quantity, ShippingAddress, Phone, Status)
            VALUES(${UserID}, ${ProductID}, ${Quantity}, ${finalAddress}, ${finalPhone}, 'Pending')
        `;

        //cập nhật sl kho
        await sql.query`
          UPDATE Products
          SET Stock = Stock - ${Quantity}
          WHERE ProductID = ${ProductID}
        `;

        const newOrder = await sql.query`
            SELECT TOP 1 o.*, p.ProductName 
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.UserID = ${UserID}
            ORDER BY OrderID DESC
        `;
        const resultOrder = newOrder.recordset.map(element => ({
            orderID: element.OrderID, 
            OrderDate: element.OrderDate,
            Status: getStatusOrder(element.Status),
            ShippingAddress: element.ShippingAddress,
            Phone: element.Phone,

            product: {
                productID: element.ProductID,
                ProductName: element.ProductName,
                Quantity: element.Quantity
            }
        }))
        if (req.user.Role === "Admin") {
            const userInfo = await sql.query`SELECT UserID, FullName, Email FROM Users WHERE UserID = ${UserID}`
            const userResult = userInfo.recordset[0];
            res.status(201).json({
                message: "Thêm thành công đơn hàng!!!",
                user: userResult,
                order: resultOrder
            });
        }
        else {
            res.status(201).json({
                message: "Thêm thành công đơn hàng!",
                order: resultOrder
            });
        }

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function updateOrder(req, res) {
    try {
        const orderID = req.params.OrderID;
        const { ProductID, Quantity } = req.body;
        
        const checkOrder = await sql.query`SELECT * FROM Orders WHERE OrderID = ${orderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        const order = checkOrder.recordset[0];

        if (req.user.UserID !== order.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền sửa đơn hàng này!",
            });
        }
        
        if (order.Status !== "Pending") {
            let statusMessage = getStatusOrder(order.Status);
            return res.status(403).json({ message: `không thể sửa đơn hàng! ${statusMessage}` })
        }
        if (ProductID !== order.ProductID) {
            const productNew = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
            if (productNew.recordset.length === 0) {
                return res.status(404).send("Không tìm thấy sản phẩm mới");
            }
            const stockNew = productNew.recordset[0].Stock;

            if (stockNew < Quantity) {
                return res.status(400).send(`Không đủ hàng tồn kho. Còn lại: ${stockNew}`);
            }

            await sql.query`
                UPDATE Products
                SET Stock = Stock - ${Quantity}
                WHERE ProductID = ${ProductID}
            `;

            await sql.query`
                UPDATE Products
                SET Stock = Stock + ${order.Quantity}
                WHERE ProductID = ${order.ProductID}
            `;

        } else {
            const infoProduct = await sql.query`SELECT * FROM Products WHERE ProductID = ${ProductID}`;
            const stockProduct = infoProduct.recordset[0].Stock;

            const newStock = stockProduct + order.Quantity - Quantity;
            if (newStock < 0) {
                return res.status(400).send(`Không đủ hàng tồn kho. Còn lại: ${stockProduct + order.Quantity}`);
            }

            await sql.query`
                UPDATE Products
                SET Stock = ${newStock}
                WHERE ProductID = ${ProductID}
            `;
        }
        await sql.query`
            UPDATE Orders 
            SET ProductID = ${ProductID}, Quantity = ${Quantity}
            WHERE OrderID = ${orderID}
        `;

        const updatedOrder = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.OrderID = ${orderID}
        `;
        const element = updatedOrder.recordset[0];
        const resultOrder = {
            OrderID: element.OrderID,
            OrderDate: element.OrderDate,
            Status: getStatusOrder(element.Status),
            Product: {
                ProductID: element.ProductID,
                ProductName: element.ProductName,
                Quantity: element.Quantity
            },
            ShippingAddress: element.ShippingAddress,
            Phone: element.Phone
        };

        res.send({
            message: "Cập nhật đơn hàng thành công!",
            order: resultOrder
        });
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}
function getStatusOrder(status) {
    switch (status) {
        case 'Pending': return "Đơn hàng đang chờ xác nhận";
        case 'Confirmed': return "Đơn hàng đã được xác nhận";
        case 'Shipped': return "Đơn hàng đang được vận chuyển";
        case 'Delivered': return "Đơn hàng đã giao thành công";
        case 'Cancelled': return "Đơn hàng đã bị hủy";
        default: return "Trạng thái đơn hàng không hợp lệ";
    }
}

async function deleteOrder(req, res) {
    try {
        const OrderID = req.params.OrderID;
        const checkOrder = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE OrderID = ${OrderID}
            `;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        const order = checkOrder.recordset[0];
        if (req.user.UserID !== order.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền xóa đơn hàng này!",
            });
        }
                      
        if (order.Status !== 'Pending') {
            let statusMessage = getStatusOrder(order.Status);
            return res.status(403).json({ message: `Bạn không thể xóa đơn hàng! ${statusMessage}` })
        }

        // await sql.query`DELETE FROM Orders WHERE OrderID = ${OrderID}`;
        await sql.query`UPDATE Orders 
            SET Status = ${"Cancelled"}
            WHERE OrderID = ${OrderID}`
            
        await sql.query`
            UPDATE Products
            SET Stock = Stock + ${order.Quantity}
            WHERE ProductID = ${order.ProductID}
            `;
        
        const resultOrder = {
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            Status: getStatusOrder("Cancelled"),
            Product: {
                ProductID: order.ProductID,
                ProductName: order.ProductName,
                Quantity: order.Quantity
            },
            ShippingAddress: order.ShippingAddress,
            Phone: order.Phone
        };
        res.json({
            message: "Xóa thành công!",
            Order: resultOrder
        })

    } catch (err) {
        res.status(500).send("Lỗii: " + err.message);
    }
}
async function confirmOrderByID(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(500).json({ message: "Bạn không có quyền sửa đơn hàng!" });
        }
        const OrderID = req.params.OrderID;
        const checkOrder = await sql.query`
            SELECT * FROM Orders WHERE OrderID = ${OrderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(403).json({ message: "Không tìm thấy đơn hàng!" });
        }
        if (checkOrder.recordset[0].Status !== "Pending") {
            let statusMessage = getStatusOrder(checkOrder.recordset[0].Status);
            return res.json({ message: statusMessage + " trước đó" });
        }
        await sql.query`UPDATE Orders
            SET Status = ${"Confirmed"}    
            WHERE OrderID = ${OrderID}
        `
        //
        const result = await sql.query`
            SELECT o.*, p.ProductName
            FROM Orders o
            JOIN Products p ON p.ProductID = o.ProductID
            WHERE o.OrderID = ${OrderID}`
        const order = result.recordset[0];
        const resultOrder = {
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            Status: getStatusOrder(order.Status),
            Product: {
                ProductID: order.ProductID,
                ProductName: order.ProductName,
                Quantity: order.Quantity
            },
            ShippingAddress: order.ShippingAddress,
            Phone: order.Phone
        };
        res.status(200).json({ 
            message: "Xác nhận đơn hàng thành công!", 
            order: resultOrder
        });
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message)
    }
}
module.exports = {
    getOrderByOrderID,
    getAllOrders,
    addOrders,
    updateOrder,
    deleteOrder,
    confirmOrderByID
};
