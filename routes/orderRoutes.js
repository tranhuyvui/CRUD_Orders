const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderController');
const handleValidation = require('../middlewares/handleValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

const {
    validatorOrderID,
    validatorAddOrder,
    validatorUpdateOrder,
} = require('../middlewares/validatorOrder');

router.get('/',authenticateToken,  orderControllers.getAllOrders);
router.post('/', authenticateToken, validatorAddOrder, handleValidation, orderControllers.addOrders);
router.put('/confirmed/:OrderID', authenticateToken, validatorOrderID, handleValidation, orderControllers.confirmOrderByID); 
router.put('/:OrderID', authenticateToken, validatorUpdateOrder, handleValidation, orderControllers.updateOrder);
router.get('/:OrderID', authenticateToken, validatorOrderID, handleValidation, orderControllers.getOrderByOrderID);
router.delete('/:OrderID', authenticateToken, validatorOrderID, handleValidation, orderControllers.deleteOrder);
module.exports = router;

