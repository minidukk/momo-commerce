const express = require('express');
const {
  checkPaymentStatus,
  updateShippingStatus,
  createOrder,
  getAllOrders,        
  updateOrderStatus,   
} = require('../controllers/orderController');

const router = express.Router();

router.post('/create', createOrder);
router.post('/check-payment-status/:orderId', checkPaymentStatus);
router.put('/update-shipping-status/:orderId', updateShippingStatus);
router.get('/', getAllOrders);
router.put('/:orderId', updateOrderStatus);

module.exports = router;
