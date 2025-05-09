const express = require('express');
const userController = require('../controllers/userController');
const { validatorID, validatorAddUser, validatorUpdateUser } = require('../middlewares/userValidator');
const handleValidation = require('../middlewares/handleValidation');

const router = express.Router();

router.get('/', userController.getAllUser);
router.get('/:UserID', validatorID, handleValidation, userController.getUserById);
router.delete('/:UserID', validatorID, handleValidation, userController.deleteUser);
router.put('/:UserID', validatorUpdateUser, handleValidation, userController.UpdateUser);
router.post('/', validatorAddUser, handleValidation, userController.addUser);

module.exports = router;
