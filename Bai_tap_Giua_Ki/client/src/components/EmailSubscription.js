import React, { useState, useEffect } from 'react';

function EmailSubscription({ user }) {
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.email && user?.email_notifications) {
      setHasSubscribed(true);
      setEmail(user.email);
      setIsLoading(false);
      return;
    }

    if (user && user.id) {
      checkSubscriptionStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        if (data.data.email && data.data.email_notifications) {
          setHasSubscribed(true);
          setEmail(data.data.email);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        const localUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...localUser,
          email: email,
          email_notifications: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setMessage({
          type: 'success',
          text: 'Đăng ký thành công! Vui lòng kiểm tra email của bạn.'
        });
        setHasSubscribed(true);
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasSubscribed) {
    return (
      <div className="email-subscription">
        <p>Bạn đã đăng ký nhận thông báo qua email: {email}</p>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="email-subscription">
      <h3>Đăng ký nhận thông báo</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default EmailSubscription; 