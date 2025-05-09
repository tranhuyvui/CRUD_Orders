const sql = require('../config/db');

async function getOrderByOrderID(req, res) {
    try {
        const OrderID = req.params.OrderID;

        const resultUser = await sql.query`SELECT FullName, Email FROM Users WHERE UserID = ${OrderID}`;
        if (resultUser.recordset.length === 0) {
            return res.status(404).send("Không có User!");
        }

        const result = await sql.query`SELECT * FROM Orders WHERE OrderID = ${OrderID}`;
        res.send({
            user: resultUser.recordset[0],
            orders: result.recordset
        });

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function getAllOrders(req, res) {
    try {
        const result = await sql.query`
            SELECT u.FullName, u.Email, o.*
            FROM Users u
            JOIN Orders o ON u.UserID = o.UserID
        `;
        res.send(result.recordset);

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addOrders(req, res) {
    try {
        const UserID = req.params.OrderID;
        const { ProductName, Quantity } = req.body;

        const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (checkUser.recordset.length === 0) {
            return res.status(404).send("Không có User để thêm Orders");
        }

        await sql.query`
            INSERT INTO Orders (UserID, ProductName, Quantity)
            VALUES(${UserID}, ${ProductName}, ${Quantity})
        `;
        res.status(201).send("Thêm thành công!");

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
        const orderOrderID = req.params.OrderID;

        const checkOrder = await sql.query`SELECT * FROM Orders WHERE OrderID = ${orderOrderID}`;
        if (checkOrder.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }

        await sql.query`DELETE FROM Orders WHERE OrderID = ${orderOrderID}`;
        res.send("Xóa thành công!");

    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

module.exports = {
    getOrderByOrderID,
    getAllOrders,
    addOrders,
    updateOrder,
    deleteOrder
};
