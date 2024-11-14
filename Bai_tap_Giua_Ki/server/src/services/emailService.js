const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',         // SMTP host
  port: 587,                      // SMTP port
  auth: {
    user: 'wingsairport73@gmail.com',
    pass: 'hhma ernj xofx geks'  // App password từ Gmail
  },
  // Tương đương với spring.mail.properties
  secure: false,                  // true cho port 465, false cho port khác
  requireTLS: true,              // Tương đương starttls.enable=true
  tls: {
    ciphers: 'SSLv3'             // Đảm bảo kết nối an toàn
  }
});

// Test kết nối
transporter.verify(function(error, success) {
  if (error) {
    console.log('Lỗi kết nối mail server:', error);
  } else {
    console.log('Mail server sẵn sàng nhận tin nhắn');
  }
});

const sendTaskNotification = async (email, task) => {
  const mailOptions = {
    from: 'wingsairport73@gmail.com',  // Cập nhật email người gửi
    to: email,
    subject: 'Thông báo công việc sắp đến hạn',
    html: `
      <h2>Công việc sắp đến hạn</h2>
      <p>Tiêu đề: ${task.title}</p>
      <p>Hạn: ${task.due_date}</p>
      <p>Mô tả: ${task.description}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendAssignedTaskNotification = async (email, task) => {
  const mailOptions = {
    from: 'your-email@domain.com',
    to: email,
    subject: 'Bạn được giao một công việc mới',
    html: `
      <h2>Công việc mới</h2>
      <p>Tiêu đề: ${task.title}</p>
      <p>Hạn: ${task.due_date}</p>
      <p>Mô tả: ${task.description}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Thêm hàm gửi mail xác nhận đăng ký
const sendSubscriptionConfirmation = async (email) => {
  const mailOptions = {
    from: 'wingsairport73@gmail.com',
    to: email,
    subject: 'Xác nhận đăng ký nhận thông báo',
    html: `
      <h2>Đăng ký nhận thông báo thành công!</h2>
      <p>Xin chào,</p>
      <p>Cảm ơn bạn đã đăng ký nhận thông báo. Từ nay, bạn sẽ nhận được các thông báo sau:</p>
      <ul style="list-style-type: none; padding-left: 20px;">
        <li>✅ Thông báo khi công việc sắp đến hạn</li>
        <li>✅ Thông báo khi được giao việc mới</li>
      </ul>
      <p>Chúc bạn có trải nghiệm tốt với hệ thống của chúng tôi!</p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        * Nếu bạn không đăng ký nhận thông báo này, vui lòng bỏ qua email này.
      </p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Đã gửi mail xác nhận đến:', email);
  } catch (error) {
    console.error('Lỗi gửi mail xác nhận:', error);
    throw error;
  }
};

module.exports = {
  sendTaskNotification,
  sendAssignedTaskNotification,
  sendSubscriptionConfirmation  // Export thêm hàm mới
}; 