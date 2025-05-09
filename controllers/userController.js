const sql = require('../config/db');

async function getAllUser(req, res) {
    try {
        const result = await sql.query`SELECT * FROM Users`;
        res.send(result.recordset);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function getUserById(req, res) {
    try {
        const UserID = req.params.UserID;

        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;

        if (result.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy người dùng");
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function addUser(req, res) {
    try {
        const { FullName, Email } = req.body;
        await sql.query`INSERT INTO Users (FullName, Email) VALUES (${FullName}, ${Email})`;
        res.send("Thêm thành công");
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}


async function deleteUser(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        await sql.query`DELETE FROM Orders WHERE UserID = ${UserID}`;
        await sql.query`DELETE FROM Users WHERE UserID = ${UserID}`;
        res.send("Xóa thành công");
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function UpdateUser(req, res) {
    try {

        const UserID = parseInt(req.params.UserID);
        const { FullName, Email } = req.body;
        await sql.query`UPDATE Users SET FullName = ${FullName}, Email = ${Email} WHERE UserID = ${UserID}`;
        res.send("Cập nhật thành công");
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

module.exports = {
    getAllUser,
    getUserById,
    addUser,
    deleteUser,
    UpdateUser
};
