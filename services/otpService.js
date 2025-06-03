const sql = require('../config/db');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendOtp(Email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const existing = await sql.query`SELECT * FROM Otpcodes WHERE Email = ${Email}`;
    if (existing.recordset.length > 0) {
        await sql.query`
            UPDATE OtpCodes SET OTP = ${otp}, ExpiresAt = ${expiresAt} WHERE Email = ${Email}
        `;
    } else {
        await sql.query`
            INSERT INTO OtpCodes (Email, OTP, ExpiresAt) VALUES (${Email}, ${otp}, ${expiresAt})
        `;
    }
    const mailOptions = {
        from: `"Cửa hàng Cao Cấp" <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Mã OTP xác thực',
        text: `Mã OTP của bạn là ${otp}. Có hiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
}

async function verifyOtp(Email, otpInput) {
    const result = await sql.query`
        SELECT OTP, ExpiresAt FROM OtpCodes WHERE Email = ${Email}
    `;
    if (result.recordset.length === 0) {
        throw { status: 400, message: "Chưa gửi OTP hoặc OTP không tồn tại" };
    }
    const { OTP, ExpiresAt } = result.recordset[0];
    if (new Date() > new Date(ExpiresAt)) {
        throw { status: 400, message: "OTP đã hết hạn" };
    }    
    if (OTP.toString() !== otpInput.toString()) {
        throw { status: 400, message: "OTP không đúng" };
    }
    await sql.query`DELETE FROM OtpCodes WHERE Email = ${Email}`;
    return true;
}
module.exports = {
    verifyOtp,
    sendOtp
}