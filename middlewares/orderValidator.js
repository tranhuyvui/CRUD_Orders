const { param, body } = require('express-validator');

exports.validatorID = [
    param('OrderID').isInt({gt: 0}).withMessage("OrderID phải là số dương!")
];

exports.validatorAddOrder = [
    param('OrderID').isInt({gt: 0}).withMessage("OrderID phải là số dương!"),
    body('ProductName').isString().withMessage("ProductName phải là chuỗi!")    
        .notEmpty().withMessage("ProductName phải khác rỗng!"),
    body('Quantity').isInt({gt: 0}).withMessage("Quantity phải là số dương!")
]

exports.validatorUpdateOrder = [
    param('OrderID').isInt({ gt: 0 }).withMessage("OrderID phải là số dương!"),
    
    body('ProductName').isString().withMessage("ProductName phải là chuỗi!")    
        .notEmpty().withMessage("ProductName phải khác rỗng!"),
        
    body('Quantity').isInt({gt: 0}).withMessage("Quantity phải là số dương!")
]

