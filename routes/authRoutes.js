const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware')

authRouter.post('/login', authController.login, authenticateToken);
authRouter.post('/register', authController.register);

module.exports = authRouter;
