const cron = require('node-cron');
const db = require('../configs/database');
const { sendTaskNotification } = require('./emailService');

// Chạy lúc 18:35 hàng ngày
cron.schedule('00 21 * * *', async () => {
  try {
    console.log('=== BẮT ĐẦU KIỂM TRA CÔNG VIỆC ===');
    console.log('Thời gian:', new Date().toLocaleString('vi-VN'));
    
    // Lấy tất cả users có đăng ký nhận mail
    const [users] = await db.query(`
      SELECT DISTINCT u.id, u.email, u.username
      FROM users u
      WHERE u.email_notifications = TRUE AND u.email IS NOT NULL
    `);

    console.log(`Tìm thấy ${users.length} người dùng đã đăng ký nhận thông báo`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Today:', today);

    // Với mỗi user, lấy tất cả tasks của họ
    for (const user of users) {
      console.log(`\nĐang kiểm tra công việc của user: ${user.username} (${user.email})`);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Tính ngày giới hạn (2 ngày sau today)
      const limitDate = new Date(today);
      limitDate.setDate(today.getDate() + 2);
      limitDate.setHours(23, 59, 59, 999);

      console.log('Khoảng thời gian kiểm tra:', {
        from: today.toLocaleDateString('vi-VN'),
        to: limitDate.toLocaleDateString('vi-VN')
      });
      
      // Lấy cả tasks được giao và tasks tự tạo
      const [userTasks] = await db.query(`
        SELECT t.*, 
          CASE 
            WHEN t.created_by = ? THEN 'Tạo bởi bạn'
            ELSE 'Được giao cho bạn'
          END as task_type
        FROM todos t
        WHERE (t.assigned_to = ? OR t.created_by = ?)
          AND t.completed = 0 
          AND t.due_date IS NOT NULL
          AND t.due_date <= DATE_ADD(CURDATE(), INTERVAL 2 DAY)
        ORDER BY t.due_date ASC
      `, [user.id, user.id, user.id]);

      console.log(`Tìm thấy ${userTasks.length} tasks cần kiểm tra`);
      
      // Lọc tasks sắp đến hạn (từ today đến 2 ngày sau)
      const dueTasks = userTasks.filter(task => {
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        // Chỉ lấy tasks từ today đến limitDate
        return dueDate >= today && dueDate <= limitDate;
      });

      console.log(`\n- Tìm thấy ${dueTasks.length} công việc sắp đến hạn`);
      
      if (dueTasks.length > 0) {
        console.log('Danh sách công việc sắp đến hạn:');
        dueTasks.forEach(task => {
          const dueDate = new Date(task.due_date);
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          console.log(`  + ${task.title} (Hạn: ${dueDate.toLocaleDateString('vi-VN')}, còn ${diffDays} ngày)`);
        });

        try {
          await sendTaskNotification(user.email, dueTasks);
          console.log('✅ Đã gửi mail thành công');
        } catch (error) {
          console.error('❌ Lỗi gửi mail:', error.message);
        }
      } else {
        console.log('- Không có công việc nào sắp đến hạn');
      }
    }

    console.log('\n=== KẾT THÚC KIỂM TRA CÔNG VIỆC ===\n');
  } catch (error) {
    console.error('❌ LỖI TRONG QUÁ TRÌNH KIỂM TRA:', error);
  }
}); 