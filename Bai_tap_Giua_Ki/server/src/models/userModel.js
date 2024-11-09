// src/models/userModel.js
const db = require('../configs/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserModel {
  async create(userData) {
    try {
      // Hash password trước khi lưu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const [result] = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [userData.username, hashedPassword, userData.role || 'user']
      );

      // Trả về user mới (không bao gồm password)
      const [newUser] = await db.query(
        'SELECT id, username, role, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async getAll() {
    try {
      const [users] = await db.query(
        'SELECT id, username, role, created_at FROM users'  // Không lấy password
      );
      return users;
    } catch (error) {
      throw new Error('Error getting users: ' + error.message);
    }
  }

  async verifyPassword(username, password) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
  
      if (!users.length) return null;
  
      const user = users[0];
      
      // Hash password người dùng nhập vào
      const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
      
      // So sánh với password đã hash trong database
      if (user.password === hashedPassword) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      throw new Error('Error verifying password: ' + error.message);
    }
  }
}

module.exports = new UserModel();