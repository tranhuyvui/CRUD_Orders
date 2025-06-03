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
            return res.status(404).send("Không tìm thấy đơn hàng");
        
        }
        const order = result.recordset[0];
        
        if (req.user.Role !== 'Admin' && req.user.UserID !== order.UserID) {
            return res.status(403).send("Bạn không có quyền truy cập đơn hàng này!");
        }
        const resultUser = await sql.query`SELECT FullName, Email FROM Users WHERE UserID = ${order.UserID}`;
        res.send({
            user: resultUser.recordset[0],
            orders: [order]
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

            res.send(result.recordset);

        }
        else {
            const userID = parseInt(req.user.UserID);
            const result = await sql.query`
                SELECT o.*, p.ProductName
                FROM Orders o
                JOIN Products p ON o.ProductID = p.ProductID
                WHERE o.UserID = ${userID}
            `;
            res.send(result.recordset);
        } 

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addOrders(req, res) {
    try {
        const userIdFromClient = req.body.UserID || req.user.UserID;

        if (req.user.UserID !== userIdFromClient && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền tạo đơn hàng cho người khác!",
                your_UserID: req.user.UserID
            });
        }

        const { ProductID, Quantity } = req.body;
        const UserID = userIdFromClient;

        const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (checkUser.recordset.length === 0) {
            return res.status(404).send("Không có User để thêm Orders");
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
            INSERT INTO Orders (UserID, ProductID, Quantity)
            VALUES(${UserID}, ${ProductID}, ${Quantity})
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

        res.status(201).json({
            message: "Thêm thành công đơn hàng!",
            order: newOrder.recordset[0]
        });

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

        if (ProductID !== order.ProductID) {
            await sql.query`
                UPDATE Products
                SET Stock = Stock + ${order.Quantity}
                WHERE ProductID = ${order.ProductID}
            `;

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
            SELECT o.*, p.ProductID
            FROM Orders o
            JOIN Products p ON o.ProductID = p.ProductID
            WHERE o.OrderID = ${orderID}
        `;

        res.send({
            message: "Cập nhật đơn hàng thành công!",
            order: updatedOrder.recordset[0]
        });
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function deleteOrder(req, res) {
    try {
        const OrderID = req.params.OrderID;

        const checkOrder = await sql.query`SELECT * FROM Orders WHERE OrderID = ${OrderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        const order = checkOrder.recordset[0];
        if (req.user.UserID !== order.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền xóa đơn hàng này!",
            });
        }

        await sql.query`DELETE FROM Orders WHERE OrderID = ${OrderID}`;
        await sql.query`
            UPDATE Products
            SET Stock = Stock + ${order.Quantity}
            WHERE ProductID = ${order.ProductID}
            `;
        res.json({
            message: "Xóa thành công!",
            Order: order
        })

    } catch (err) {
        res.status(500).send("Lỗii: " + err.message);
    }
}

module.exports = {
    getOrderByOrderID,
    getAllOrders,
    addOrders,
    updateOrder,
    deleteOrder
};
