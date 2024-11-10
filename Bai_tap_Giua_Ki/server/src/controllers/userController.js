// src/controllers/userController.js
const UserModel = require('../models/userModel');

class UserController {
  // Lấy tất cả users
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.json({
        status: 'success',
        data: users
      });
    } catch (error) {
      console.error('Controller - Error in getAllUsers:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }
  
  // Đăng ký user mới
  async register(req, res) {
    try {
      const { username, password, role = 'user' } = req.body;
      
      // Validate
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username và password là bắt buộc'
        });
      }

      // Kiểm tra username đã tồn tại
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Username đã tồn tại'
        });
      }

      // Tạo user mới với password đã hash bằng SHA2
      const newUser = await UserModel.create({ 
        username, 
        password,  // Password sẽ được hash trong Model
        role 
      });

      // Loại bỏ password trước khi trả về
      delete newUser.password;

      res.status(201).json({
        status: 'success',
        data: newUser
      });
    } catch (error) {
      console.error('Controller - Error in register:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

  // Đăng nhập
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Validate
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username và password là bắt buộc'
        });
      }

      const user = await UserModel.verifyPassword(username, password);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Username hoặc password không đúng'
        });
      }

      // Loại bỏ password trước khi trả về
      delete user.password;

      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      console.error('Controller - Error in login:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }
}

module.exports = new UserController();