import React, { useState } from 'react';
import { userService } from '../services/userService';

function Register({ onRegisterSuccess, onSwitchToLogin }) { // Thêm prop onSwitchToLogin
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await userService.register(formData);
      if (result.status === 'success') {
        onRegisterSuccess();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng ký tài khoản</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <select 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="role-select"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button type="submit" className="login-button">Đăng ký</button>
        
        <div className="register-link">
          Đã có tài khoản? <button onClick={onSwitchToLogin} className="register-button">Đăng nhập</button>
        </div>
      </form>
    </div>
  );
}

export default Register;