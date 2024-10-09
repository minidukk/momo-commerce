const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  products: { type: Array, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  shippingStatus: { type: String, default: 'Pending' },
  orderId: { type: String },//, required: true},
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
