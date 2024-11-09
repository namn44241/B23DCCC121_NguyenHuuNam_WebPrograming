// src/controllers/userController.js
const UserModel = require('../models/userModel');

class UserController {
  // Đăng ký user mới
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
  
  async register(req, res) {
    try {
      const { username, password } = req.body;
      
      // Validate
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required'
        });
      }

      const newUser = await UserModel.create({ username, password });
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
          message: 'Username and password are required'
        });
      }

      const user = await UserModel.verifyPassword(username, password);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password'
        });
      }

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