const bcrypt = require('bcryptjs');

const hashPassword = async (req, res, next) => {
    try {
        const { Password } = req.body;
        if (!Password) {
            return res.status(400).json({ message: "Thiếu mật khẩu" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        req.body.PasswordHash = hashedPassword;
        next();
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi mã hóa mật khẩu", error: err.message });
    }
};

module.exports = hashPassword;
