const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const router = express.Router();

// Route để đăng ký người dùng
router.post('/register', register);

// Route để đăng nhập người dùng
router.post('/login', login);

// Route để lấy thông tin người dùng hiện tại
router.get('/me', getMe);

module.exports = router;
