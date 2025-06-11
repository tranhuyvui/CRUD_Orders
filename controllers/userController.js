const sql = require('../config/db');

async function getAllUser(req, res) {
    try {
        const UserID = req.user.UserID;
        if (req.user.Role === "User") {
            const checkUser = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
            if (checkUser.recordset.length === 0) {
                return res.status(404).send("Không tìm thấy người dùng");
            }
            return res.send(checkUser.recordset[0]);
        }
        const result = await sql.query`SELECT * FROM Users`;
        return res.send(result.recordset);
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
        const UserID = req.user.Role === "User" ? req.user.UserID : req.params.UserID;
        if (req.user.Role === "Admin" && !UserID) {
            return res.status(404).send("Không có UserID người dùng nào để xóa");
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
        const isAdmin = req.user.Role === "Admin";
        const UserID = isAdmin ? (req.params.UserID) : req.user.UserID;
        if (isAdmin && !UserID) {
            return res.status(400).send("Thiếu hoặc sai định dạng UserID");
        }

        const { FullName, Email, Username, Phone, ShippingAddress } = req.body;

        if (!FullName && !Email && !Username && !Phone && !Address) {
            return res.status(400).send("Không có dữ liệu để cập nhật");
        }

        const curUserResult = await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
        const curUser = curUserResult.recordset[0];

        if (!curUser) {
            return res.status(404).send("Không tìm thấy người dùng");
        }

        await sql.query`
            UPDATE Users 
            SET FullName = ${FullName || curUser.FullName},
                Email = ${Email || curUser.Email},
                Phone = ${Phone || curUser.Phone},
                Address = ${ShippingAddress || curUser.Address}
            WHERE UserID = ${UserID}
        `;

        if (Username) {
            await sql.query`
                UPDATE Auth
                SET Username = ${Username}
                WHERE UserID = ${UserID}
            `;
        }

        res.json({ message: "Cập nhật thành công" });
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
