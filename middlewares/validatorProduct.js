const {param, body } = require('express-validator');

exports.validatorAddProduct = [
    body('ProductName')
        .isString().withMessage('Tên sản phẩm phải là chuỗi!')
        .notEmpty().withMessage('Tên sản phẩm không được để trống!'),

    body('Price')
        .isFloat({ gt: 0 }).withMessage('Giá phải là số dương!'),

    body('Stock')
        .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên >= 0!')
];
exports.validatorUpdateProduct = [
    param('ProductID')
        .isInt({ min: 1 }).withMessage('ID sản phẩm phải là số nguyên dương!'),

    body('ProductName')
        .optional()
        .isString().withMessage('Tên sản phẩm phải là chuỗi!')
        .notEmpty().withMessage('Tên sản phẩm không được để trống!'),

    body('Price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('Giá phải là số thực dương!'),

    body('Stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm!')
];
exports.validatorDeleteProduct = [
    param('ProductID').isInt({ min: 1 }).withMessage('ID sản phẩm phải lớn hơn 0')
]   
exports.validatorGetProductByID = [
    param('ProductID').isInt({ min: 1 }).withMessage('ID sản phẩm phải lớn hơn 0')
]



