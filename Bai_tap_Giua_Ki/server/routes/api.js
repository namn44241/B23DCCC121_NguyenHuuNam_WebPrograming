const express = require('express');
const router = express.Router();
const db = require('../src/configs/database');
const { sendSubscriptionConfirmation } = require('../src/services/emailService');

router.post('/subscribe', async (req, res) => {
  try {
    const { userId, email } = req.body;
    
    console.log('Received subscription request:', { userId, email });

    if (!userId || !email) {
      return res.status(400).json({ 
        error: 'UserId và email là bắt buộc' 
      });
    }

    // Kiểm tra user tồn tại
    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        error: 'Không tìm thấy user' 
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
      success: true,
      message: 'Đăng ký nhận thông báo thành công'
    });

  } catch (error) {
    console.error('Detailed subscription error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router; 