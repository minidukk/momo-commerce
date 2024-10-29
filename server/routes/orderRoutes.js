const express = require('express');
const {
  checkPaymentStatus,
  updateShippingStatus,
//  createOrder,
  getAllOrders,        
    updateOrderStatus,
  getUserOrder,
  updatePaymentStatusByOrderId
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');

const router = express.Router();

// router.post('/create', createOrder);
router.post('/check-payment-status/:orderId', checkPaymentStatus);
router.put('/update-shipping-status/:orderId', updateShippingStatus);
router.get('/', protect, admin, getAllOrders);
router.get('/user/:username', getUserOrder);
router.put('/update-status/:orderId', updateOrderStatus);
router.put('/update-status-by-orderId', updatePaymentStatusByOrderId);

// router.get('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     // Tìm đơn hàng theo orderId
//     const order = await Order.findOne({ orderId: orderId });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     return res.status(200).json(order);
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return res.status(500).json({ message: 'Error fetching order' });
//   }
// });

module.exports = router;
