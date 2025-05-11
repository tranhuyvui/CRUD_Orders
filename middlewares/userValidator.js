const { param, body } = require('express-validator');

exports.validatorID = [
    param('UserID').isInt().withMessage("OrderID phải là số dương!")
];

exports.validatorUpdateUser = [
    param('UserID').isInt({ gt: 0 }).withMessage("UserID phải là số dương!"),
    body('FullName').isString().withMessage("FullName phải là chuỗi!")
        .notEmpty().withMessage("FullName phải khác rỗng!"),
    body('Email').isString().withMessage("Email phải là chuỗi!")
        .notEmpty().withMessage("Email phải khác rỗng!")
]