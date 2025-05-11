const sql = require('../config/db');

async function getAllUser(req, res) {
    try {
        if (req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền truy cập tất cả người dùng!");
        }

        const result = await sql.query`SELECT * FROM Users`;
        res.send(result.recordset);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function getUserById(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        
        if (req.user.UserID !== UserID && req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền xem người dùng này!");
        }

        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        if (result.recordset.length === 0) {
            return res.status(404).send("Không tìm thấy người dùng");
        }        

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function deleteUser(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        if (req.user.Role !== "Admin" && req.user.UserID !== UserID) {
            return res.status(403).send("Bạn không có quyền xóa người dùng này!");
        }

        await sql.query`DELETE FROM Orders WHERE UserID = ${UserID}`;
        await sql.query`DELETE FROM Auth WHERE UserID = ${UserID}`;
        await sql.query`DELETE FROM Users WHERE UserID = ${UserID}`;
        res.send("Xóa thành công");
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
}

async function UpdateUser(req, res) {
    try {
        const UserID = parseInt(req.params.UserID);
        if (req.user.UserID !== UserID && req.user.Role !== "Admin") {
            return res.status(403).send("Bạn không có quyền sửa người dùng này!");
        }

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
    deleteUser,
    UpdateUser
};
