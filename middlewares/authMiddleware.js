const jwt = require('jsonwebtoken');
const sql = require('../config/db')

const authenticateToken = async(req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader;

    if (!token) {
        return res.status(401).json({ message: "Token không tồn tại!!" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
        
        if (err) return res.status(403).json({ message: "Token không hợp lệ!" });

        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${user.UserID}`;
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Tài khoản không còn tồn tại!" });
        }
        req.user = user;
        next(); 
    });
}

module.exports = { authenticateToken };