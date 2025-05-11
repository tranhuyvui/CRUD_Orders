const { loginService, registerService } = require('../services/authService');

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
        const data = await registerService(req.body, req.user);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: "Lỗi: " + err.message });
    }
}

module.exports = {
    login,
    register
};
