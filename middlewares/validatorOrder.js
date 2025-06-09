const { param, body } = require('express-validator');

exports.validatorOrderID = [
    param('OrderID')
        .isInt({ min: 1 })
        .withMessage("OrderID phải là số nguyên dương!")
];

exports.validatorAddOrder = [
    body('ProductID')
        .isInt({ min: 1 })
        .withMessage("ID sản phẩm phải là số dương!"),
    body('Quantity')
        .isInt({ min: 1 })
        .withMessage("số lượng sản phẩm phải là số dương!")
];

exports.validatorUpdateOrder = [
    param('OrderID').isInt({min : 1}).withMessage("ID đơn hàng phải là số dương"),
    body('ProductID')
        .isInt({ min: 1 })
        .withMessage("ID sản phẩm phải là số dương!"),
    body('Quantity')
        .isInt({ min: 1 })
        .withMessage("số lượng sản phẩm phải là số dương!")
];
