// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const db = require('../configs/database');
const { sendSubscriptionConfirmation } = require('../services/emailService');

// Register
router.post('/register', UserController.register);

// Login
router.post('/login', UserController.login);

// Thêm route mới
router.get('/', UserController.getAllUsers);

// Thêm route subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, email } = req.body;
    
    console.log('Received subscription request:', { userId, email });

    if (!userId || !email) {
      return res.status(400).json({ 
        status: 'error',
        message: 'UserId và email là bắt buộc' 
      });
    }

    // Kiểm tra user tồn tại
    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Không tìm thấy user' 
      });
    }

    // Cập nhật email trong database
    await db.query(
      'UPDATE users SET email = ?, email_notifications = TRUE WHERE id = ?',
      [email, userId]
    );

    // Gửi mail xác nhận
    await sendSubscriptionConfirmation(email);

    console.log('Subscription successful for:', email);

    res.json({ 
      status: 'success',
      message: 'Đăng ký nhận thông báo thành công'
    });

  } catch (error) {
    console.error('Detailed subscription error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

module.exports = router;