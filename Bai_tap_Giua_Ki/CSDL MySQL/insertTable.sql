-- Insert users (3 users với các role khác nhau)
INSERT INTO users (username, password, role) VALUES
('admin1', SHA2('1', 256), 'admin'),
('manager1', SHA2('1', 256), 'manager'),
('user1', SHA2('1', 256), 'user');

-- Insert todos với created_by và assigned_to tham chiếu đến users thực tế (4,7,8)
INSERT INTO todos (title, description, due_date, completed, created_by, assigned_to) VALUES
('Hoàn thiện báo cáo Q1', 'Tổng hợp số liệu và phân tích', '2024-04-15', 0, 4, 7),
('Họp team tuần', 'Review công việc và lập kế hoạch', '2024-04-10', 1, 4, 7), 
('Triển khai dự án mới', 'Lên kế hoạch và phân công', '2024-04-20', 0, 7, 8),
('Tối ưu hóa database', 'Cải thiện hiệu suất truy vấn', '2024-04-25', 0, 4, 8),
('Update phần mềm', 'Cập nhật lên version mới nhất', '2024-04-12', 1, 7, 8),
('Kiểm tra bảo mật', 'Rà soát lỗ hổng bảo mật', '2024-04-18', 0, 4, 7),
('Training nhân viên mới', 'Hướng dẫn quy trình làm việc', '2024-04-22', 0, 7, 8),
('Backup dữ liệu', 'Sao lưu toàn bộ hệ thống', '2024-04-11', 1, 4, 8),
('Viết tài liệu API', 'Documentation cho REST API', '2024-04-28', 0, 7, 8),
('Fix bugs trên production', 'Sửa lỗi gấp', '2024-04-09', 1, 4, 7),
('Tối ưu giao diện', 'Cải thiện UI/UX', '2024-04-30', 0, 7, 8),
('Nghiên cứu công nghệ mới', 'Đánh giá framework mới', '2024-05-05', 0, 4, 7),
('Chuẩn bị meeting', 'Họp với khách hàng', '2024-04-13', 1, 7, 8),
('Review code', 'Kiểm tra code của team', '2024-04-17', 0, 4, 7),
('Setup môi trường dev', 'Cấu hình môi trường phát triển', '2024-04-19', 0, 7, 8),
('Viết unit test', 'Tăng độ coverage', '2024-04-21', 0, 4, 8),
('Thiết kế database', 'Lên schema cho dự án mới', '2024-04-23', 0, 7, 7),
('Tối ưu performance', 'Cải thiện tốc độ load', '2024-04-26', 0, 4, 8),
('Làm tài liệu hướng dẫn', 'Viết documentation', '2024-04-29', 0, 7, 8),
('Deploy lên production', 'Triển khai phiên bản mới', '2024-05-02', 0, 4, 7);

-- Insert subtasks với assigned_to tham chiếu đến users thực tế (4,7,8)
INSERT INTO subtasks (todo_id, title, due_date, assigned_to, completed, created_by) VALUES
(1, 'Thu thập số liệu', '2024-04-12', 8, true, 4),
(1, 'Phân tích dữ liệu', '2024-04-13', 7, false, 4),
(1, 'Viết báo cáo', '2024-04-14', 7, false, 4),
(3, 'Lên kế hoạch', '2024-04-18', 8, false, 7),
(3, 'Phân công nhiệm vụ', '2024-04-19', 7, false, 7),
(4, 'Analyze query', '2024-04-22', 8, false, 4),
(4, 'Optimize indexes', '2024-04-23', 8, false, 4),
(7, 'Chuẩn bị tài liệu', '2024-04-20', 7, true, 7),
(7, 'Setup môi trường', '2024-04-21', 8, false, 7),
(9, 'Viết API specs', '2024-04-25', 8, false, 7);