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

  // Đăng ký
  register: async (userData) => {
    // Sử dụng crypto để hash password giống MySQL SHA2()
    const msgUint8 = new TextEncoder().encode(userData.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        password: hashedPassword
      })
    });
    return res.json();
  },

  // Lấy danh sách users
  getAllUsers: async () => {
    const res = await fetch(API_URL);
    return res.json();
  }
};