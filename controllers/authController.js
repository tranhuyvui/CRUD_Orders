const { loginService, registerService, resetPasswordService } = require('../services/authService');
const { verifyOtp } = require('../services/otpService');
// const sql = require
async function login(req, res) {
    try {
        const data = await loginService(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server: " + err.message });
    }
}


async function register(req, res) {
    try {
        const { OTP, Email } = req.body;
        await verifyOtp(Email, OTP);

        const data = await registerService(req.body, req.user);
        res.status(201).json(data);
    } catch (err) {
        res.status(err.status || 500).json({ message: "Lỗi: " + err.message });
    }
}
async function resetPassword(req, res) {
    try {
        const { Email, PasswordHash  } = req.body;
        
        await resetPasswordService(Email, PasswordHash);
        
        res.json({ message: "Đặt lại mật khẩu thành công" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
module.exports = {
    login,
    register,
    resetPassword
};
