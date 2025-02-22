const axios = require('axios');
const Order = require('../models/orderModel');

const checkPaymentStatus = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findOne({ momoOrderId: orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const response = await axios.post('http://localhost:5000/api/momo/check-status-transaction', {
      orderId: orderId,
    });

    const paymentStatus = response.data.resultCode === 0 ? 'Successful' : 'Failed';

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: 'Payment status updated', paymentStatus });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Error checking payment status', error: error.message });
  }
};

const updateShippingStatus = async (req, res) => {
  const { orderId } = req.params;
  const { shippingStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.shippingStatus = shippingStatus;
    await order.save();

    res.json({ message: 'Shipping status updated', shippingStatus });
  } catch (error) {
    console.error('Error updating shipping status:', error);
    res.status(500).json({ message: 'Error updating shipping status', error: error.message });
  }
};

// const createOrder = async (req, res) => {

//   const { fullName, address, products, totalPrice } = req.body;

//   try {
//     const order = new Order({
//       fullName,
//       address,
//       products,
//       totalPrice,
//       paymentStatus: 'Pending',
//       shippingStatus: 'Pending',
//       orderId: global.orderId,
//       createdAt: new Date(),
//     });

//     await order.save();
//     res.status(201).json({ message: 'Order created successfully', order });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Error creating order', error: error.message });
//   }
// };


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus, shippingStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (shippingStatus) order.shippingStatus = shippingStatus;

    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status32:', error);
    // res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

const getUserOrder = async (req, res) => {
  const { username } = req.params;
  try {
    const orders = await Order.find({ userId: username }).populate('products.product');  
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders for user' });
  }
}

const updatePaymentStatusByOrderId = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  try {
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      order.paymentStatus = paymentStatus;
      await order.save();

      res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  checkPaymentStatus,
  updateShippingStatus,
  //  createOrder,
  getAllOrders,
  updateOrderStatus,
  getUserOrder,
  updatePaymentStatusByOrderId
};
