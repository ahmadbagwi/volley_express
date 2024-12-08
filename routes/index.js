const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { validateOrder, validateSignUp, validateLogin } = require('../utils/validators')
const OrderController = require('../controllers/OrderController')
const UserController = require('../controllers/UserController')

router.get('/check-available', OrderController.findAvailable)
router.get('/orders', OrderController.findOrders)
router.get('/orders-member/:id', OrderController.findOrdersByUserId)
router.post('/order', validateOrder, OrderController.createOrder)
router.get('/order/:id', OrderController.findOrderById)
router.put('/order/:id', validateOrder, OrderController.updateOrder)
router.delete('/order/:id', OrderController.deleteOrder)
router.get('/users', UserController.findUsers)
router.post('/signup', validateSignUp, UserController.createUser)
router.post('/login', validateLogin, UserController.loginUser)

//export router
module.exports = router