const express = require('express');
const { addProduct, updateProduct, deleteProduct, getProducts, getProductById } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');
const router = express.Router();

router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.post('/', protect, admin, upload.single('image'), addProduct);

router.get('/:id', getProductById);
router.get('/', getProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
