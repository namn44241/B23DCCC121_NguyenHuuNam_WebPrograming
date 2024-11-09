// src/services/userService.js
const API_URL = 'http://localhost:5000/api/users';

export const userService = {
  // Đăng nhập
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  // Lấy danh sách users
  getAllUsers: async () => {
    const res = await fetch(API_URL);
    return res.json();
  }
};