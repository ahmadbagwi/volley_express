//import express validator
const { body } = require('express-validator');

//definisikan validasi untuk post
const validateOrder= [
    body('name').notEmpty().withMessage('Title is required'),
    body('phone').notEmpty().withMessage('Content is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('start').notEmpty().withMessage('Start is required'),
    body('end').notEmpty().withMessage('End is required')
];

//definisikan validasi untuk signup
const validateSignUp= [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

//definisikan validasi untuk login
const validateLogin= [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { 
    validateOrder,
    validateSignUp,
    validateLogin
};