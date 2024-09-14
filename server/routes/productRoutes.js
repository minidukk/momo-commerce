const express = require('express');
const { addProduct, updateProduct, deleteProduct, getProducts, getProductById } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // Import multer config
const router = express.Router();


router.post('/', protect, admin, upload.single('image'), addProduct);

// Các route khác
router.get('/:id', getProductById);
router.get('/', getProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
