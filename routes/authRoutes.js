const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware')
const otpController = require('../controllers/otpController');
const hashPassword = require('../middlewares/hashPassword');
const { validatorLogin, validatorRegister } = require('../middlewares/validatorLogin_Register');
const handleValidation = require('../middlewares/handleValidation');


authRouter.post('/login', validatorLogin, handleValidation, authController.login, authenticateToken);
authRouter.get('/logout', authController.logOut);
authRouter.post('/register/sendotp', otpController.sendOtpRegisterController);
authRouter.post('/register/verify', validatorRegister, handleValidation, hashPassword, authController.register);

authRouter.post('/forgot-password/sendotp', otpController.sendOtpForgotController); 
authRouter.post('/forgot-password/verify', validatorRegister, handleValidation, otpController.verifyOtpController, hashPassword, authController.resetPassword);

module.exports = authRouter;
