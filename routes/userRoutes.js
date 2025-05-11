const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')
const { validatorID, validatorUpdateUser } = require('../middlewares/userValidator');
const handleValidation = require('../middlewares/handleValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUser);
router.get('/:UserID', authenticateToken, validatorID, handleValidation, userController.getUserById);
router.delete('/:UserID', authenticateToken, validatorID, handleValidation, userController.deleteUser);
router.put('/:UserID', authenticateToken, validatorUpdateUser, handleValidation, userController.UpdateUser);
router.post('/register', authenticateToken, authController.register);

module.exports = router;
