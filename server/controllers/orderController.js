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
  
const createOrder = async (req, res) => {

  const { fullName, address, products, totalPrice } = req.body;

  try {
      const order = new Order({
          fullName,
          address,
          products,
          totalPrice,
          paymentStatus: 'Pending',
        shippingStatus: 'Pending',
        orderId: global.orderId,
          createdAt: new Date(), 
      });

      await order.save();
      res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
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
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

module.exports = {
  checkPaymentStatus,
  updateShippingStatus,
  createOrder,
  getAllOrders,        
  updateOrderStatus,   
};
