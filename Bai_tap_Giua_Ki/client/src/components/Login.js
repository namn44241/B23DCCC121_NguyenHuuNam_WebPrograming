// src/components/Login.js
import React, { useState } from 'react';
import { userService } from '../services/userService';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await userService.login(username, password);
      if (result.status === 'success') {
        onLogin(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;