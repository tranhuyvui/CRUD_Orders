const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderController');
const handleValidation = require('../middlewares/handleValidation');

const {
    validatorID,
    validatorAddOrder,
    validatorUpdateOrder
} = require('../middlewares/orderValidator');

router.get('/', orderControllers.getAllOrders);
router.get('/:OrderID',validatorID, handleValidation, orderControllers.getOrderByOrderID);
router.post('/:OrderID', validatorAddOrder, handleValidation, orderControllers.addOrders);
router.put('/:OrderID', validatorUpdateOrder, handleValidation, orderControllers.updateOrder);
router.delete('/:OrderID',validatorID, handleValidation, orderControllers.deleteOrder);
 
module.exports = router;
