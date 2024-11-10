// src/models/userModel.js
const db = require('../configs/database');

class UserModel {
  async create(userData) {
    try {
      // Sử dụng SHA2 trực tiếp trong query MySQL
      const [result] = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, SHA2(?, 256), ?)',
        [userData.username, userData.password, userData.role || 'user']
      );

      // Trả về user mới (không bao gồm password)
      const [newUser] = await db.query(
        'SELECT id, username, role, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Username đã tồn tại');
      }
      throw new Error('Lỗi tạo user: ' + error.message);
    }
  }

  async getAll() {
    try {
      const [users] = await db.query(
        'SELECT id, username, role, created_at FROM users'  // Không lấy password
      );
      return users;
    } catch (error) {
      throw new Error('Lỗi lấy danh sách users: ' + error.message);
    }
  }

  async verifyPassword(username, password) {
    try {
      // So sánh password đã hash bằng SHA2 trực tiếp trong query
      const [users] = await db.query(
        'SELECT id, username, role, created_at FROM users WHERE username = ? AND password = SHA2(?, 256)',
        [username, password]
      );
  
      return users[0] || null;
    } catch (error) {
      throw new Error('Lỗi xác thực password: ' + error.message);
    }
  }

  async findByUsername(username) {
    try {
      const [users] = await db.query(
        'SELECT id, username, role, created_at FROM users WHERE username = ?',
        [username]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error('Lỗi tìm user: ' + error.message);
    }
  }
}

module.exports = new UserModel();