const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')
const { validatorID, validatorUpdateUser } = require('../middlewares/validatorUser');
const handleValidation = require('../middlewares/handleValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUser);
// router.post('/', authenticateToken, userController.deleteUser);
router.get('/:UserID', authenticateToken, validatorID, handleValidation, userController.getUserById);
router.delete('/:UserID', authenticateToken, validatorID, handleValidation, userController.deleteUser);
router.put('/:UserID', authenticateToken, validatorUpdateUser, handleValidation, userController.UpdateUser);

module.exports = router;
