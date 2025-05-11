const sql = require('../config/db');

async function getOrderByOrderID(req, res) {
    try {
        const OrderID = parseInt(req.params.OrderID);
        const result = await sql.query`
            SELECT *
            FROM Orders o
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
                SELECT u.FullName, u.Email, o.*
                FROM Users u
                JOIN Orders o ON u.UserID = o.UserID
            `
            res.send(result.recordset);

        }
        else {
            const userID = parseInt(req.user.UserID);
                const result = await sql.query`
                SELECT *
                FROM Orders o
                WHERE o.UserID = ${userID}
            `
            res.send(result.recordset);
        }

        

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addOrders(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        const { ProductName, Quantity } = req.body;

        if (req.user.UserID !== UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền tạo đơn hàng cho người khác!",
                your_UserID: req.user.UserID
            })
        }

        const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (checkUser.recordset.length === 0) {
            return res.status(404).send("Không có User để thêm Orders");
        }

        await sql.query`
            INSERT INTO Orders (UserID, ProductName, Quantity)
            VALUES(${UserID}, ${ProductName}, ${Quantity})
        `;
        const newOrder = await sql.query`
            SELECT TOP 1 * FROM Orders
            WHERE UserID = ${UserID}
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
        const orderOrderID = req.params.OrderID;
        const { ProductName, Quantity } = req.body;
        
        const checkOrder = await sql.query`SELECT * FROM Orders WHERE OrderID = ${orderOrderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        const order = checkOrder.recordset[0];
        if (req.user.UserID !== order.UserID && req.user.Role !== "Admin") {
            return res.status(403).json({
                message: "Bạn không có quyền sửa đơn hàng này!",
            });
        }

        await sql.query`
            UPDATE Orders 
            SET ProductName = ${ProductName}, Quantity = ${Quantity}
            WHERE OrderID = ${orderOrderID}
        `;

        res.send("Sửa thành công!");
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
