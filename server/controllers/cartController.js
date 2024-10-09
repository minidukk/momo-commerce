const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; 

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; 

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id; 

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart
};
