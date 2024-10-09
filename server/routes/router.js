const express = require('express');
const router = express.Router();
const momoPaymentMiddleware = require('../middleware/momoPaymentMiddleware');
const { createOrder } = require('../controllers/orderController');

router.post('/momo', momoPaymentMiddleware, createOrder);

module.exports = router;