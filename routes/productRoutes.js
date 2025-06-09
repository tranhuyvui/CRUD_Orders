const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const handleValidation = require('../middlewares/handleValidation');
const {validatorAddProduct,
    validatorUpdateProduct,
    validatorGetProductByID,
    validatorDeleteProduct
} = require('../middlewares/validatorProduct')


router.get('/', authenticateToken, productController.getAllProductController);
router.get('/:ProductID',authenticateToken, validatorGetProductByID, handleValidation, productController.getProductByIDController);
router.post('/', authenticateToken, validatorAddProduct, handleValidation, productController.addProductController);
router.delete('/:ProductID', authenticateToken, validatorDeleteProduct, handleValidation, productController.deleteProductController);
router.put('/:ProductID', authenticateToken, validatorUpdateProduct, handleValidation, productController.updateProductController);

module.exports = router;

