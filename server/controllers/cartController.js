const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; 

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng cho người dùng, tạo mới
      cart = new Cart({ user: userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex > -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.items[productIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Lấy user ID từ token (cần có middleware xác thực)

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

// Lấy thông tin giỏ hàng
const getCart = async (req, res) => {
  const userId = req.user.id; // Lấy user ID từ token (cần có middleware xác thực)

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
