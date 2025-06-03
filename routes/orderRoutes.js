const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderController');
const handleValidation = require('../middlewares/handleValidation');
const { authenticateToken } = require('../middlewares/authMiddleware');

const {
    validatorOrderID,
    validatorAddOrder,
    validatorUpdateOrder
} = require('../middlewares/orderValidator');

router.get('/',authenticateToken,  orderControllers.getAllOrders);
router.get('/:OrderID', authenticateToken, validatorOrderID, handleValidation, orderControllers.getOrderByOrderID);
router.post('/', authenticateToken, orderControllers.addOrders);
router.put('/:OrderID', authenticateToken, orderControllers.updateOrder);
router.delete('/:OrderID', authenticateToken, validatorOrderID, handleValidation, orderControllers.deleteOrder);
 
module.exports = router;

