const { param, body } = require('express-validator');

exports.validatorOrderID = [
    param('OrderID')
        .isInt({ gt: 0 })
        .withMessage("OrderID phải là số dương!")
];

exports.validatorUserID = [
    param('UserID')
        .isInt({ gt: 0 })
        .withMessage("UserID phải là số dương!")
];

exports.validatorAddOrder = [
    ...exports.validatorUserID,
    body('ProductName')
        .isString().withMessage("ProductName phải là chuỗi!")
        .notEmpty().withMessage("ProductName phải khác rỗng!"),
    body('Quantity')
        .isInt({ gt: 0 })
        .withMessage("Quantity phải là số dương!")
];

exports.validatorUpdateOrder = [
    ...exports.validatorOrderID,
    body('ProductName')
        .isString().withMessage("ProductName phải là chuỗi!")
        .notEmpty().withMessage("ProductName phải khác rỗng!"),
    body('Quantity')
        .isInt({ gt: 0 })
        .withMessage("Quantity phải là số dương!")
];
