const sql = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function loginService({Username, Password}) {
    const result = await sql.query`
        SELECT u.UserID, u.PasswordHash, a.FullName, a.Email, a.Role
        FROM Auth u
        JOIN Users a ON u.UserID = a.UserID
        WHERE u.Username = ${Username}
    `;

    if (result.recordset.length === 0) {
        throw { status: 401 , message: "Sai tài khoản hoặc mật khẩu!" };
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
        throw { status: 401 , message: "Sai tài khoản hoặc mật khẩu!" };
    }
    
    const token = jwt.sign(
        { UserID: user.UserID, Role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        message: "Đăng nhập thành công!",
        token,
        FullName: user.FullName,
        Email: user.Email,
        Role: user.Role
    };
}
async function registerService({Username, FullName, Email, ShippingAddress, Phone, PasswordHash, Role = "User" }, currentUser){
    
    
    if (currentUser && currentUser.Role !== "Admin") {
        throw { status: 403, message: "chỉ admin mới được tạo tài khoản!!" };
    }

    const check = await sql.query`SELECT * FROM Auth WHERE Username = ${Username}`;
    if (check.recordset.length > 0) {
        throw { status: 400, message: "Username đã tồn tại" };
    }

    const result = await sql.query`
        INSERT INTO Users (FullName, Email, Address, Phone, Role)
        OUTPUT INSERTED.UserID
        VALUES (${FullName}, ${Email}, ${ShippingAddress}, ${Phone}, ${Role})
    `;
    const UserID = result.recordset[0].UserID;
    await sql.query`
        INSERT INTO Auth (UserID, Username, PasswordHash)
        VALUES (${UserID}, ${Username}, ${PasswordHash})
    `;
    
    if (currentUser && currentUser.user.Role === "Admin") {
        return {
            message: "Admin đã tạo tài khoản thành công",
            newUser: {
                UserID,
                Username,
                FullName,
                Email,
                Role
            }
        };
    }
    return { message: "Đăng ký thành công" };
}
async function resetPasswordService(Email, PasswordHash) {
    const result = await sql.query`
        UPDATE Auth
        SET PasswordHash = ${PasswordHash}
        WHERE UserID = (
            SELECT UserID FROM Users WHERE Email = ${Email}
        )
    `;
    return result;
}
module.exports = {
    loginService,
    registerService,
    resetPasswordService
}
