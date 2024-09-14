const express = require('express');
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController');
const { protect, admin } = require('../middleware/authMiddleware'); // Sửa đường dẫn nếu cần
const router = express.Router();

// Route thêm sản phẩm vào giỏ hàng
router.post('/add', protect, addToCart);

// Route xóa sản phẩm khỏi giỏ hàng
router.post('/remove', protect, removeFromCart);

// Route lấy thông tin giỏ hàng
router.get('/', protect, getCart);

module.exports = router;
