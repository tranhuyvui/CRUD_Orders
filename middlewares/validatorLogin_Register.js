const { body } = require('express-validator');

exports.validatorLogin = [
    body('Email').isEmail().withMessage('Email không hợp lệ'),
    body('Password').notEmpty().withMessage('Mật khẩu không được để trống')
];

exports.validatorRegister = [
    body('Email').isEmail().withMessage('Email không hợp lệ'),
    body('Password').isLength({ min: 1 }).withMessage('Mật khẩu phải ít nhất 1 ký tự'),
    body('FullName').notEmpty().withMessage('Họ tên không được để trống')
];
