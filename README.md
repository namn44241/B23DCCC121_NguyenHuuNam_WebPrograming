# NOTEBOOK MÔN LẬP TRÌNH WEB - THẦY VŨ VĂN THƯƠNG PTIT

## MSV: B23DCCC121
## TÊN: NGUYỄN HỮU NAM
## LỚP: D23CQCC01-B

## Hướng dẫn chi tiết Bai_tap_Giua_Ki

1. Di chuyển vào thư mục `Bai_tap_Giua_Ki`:
    ```bash
    cd Bai_tap_Giua_Ki
    ```

2. Khởi động Docker Compose để chạy các dịch vụ:
    ```bash
    docker-compose up -d
    ```

3. Truy cập vào phpMyAdmin:
    - Đường dẫn: [localhost:8080](http://localhost:8844)
    - Tài khoản: `baitap`
    - Mật khẩu: `1`

4. Trong phpMyAdmin, chọn cơ sở dữ liệu và chèn dữ liệu từ các tệp trong thư mục `CDSL MYSQL`.

5. Mở trình duyệt và truy cập [localhost:3000](http://localhost:3000):
    - Đăng nhập bằng tài khoản: `admin`
    - Mật khẩu: `1`

6. Sau khi đăng nhập, xem và kiểm tra các tính năng

## Tính năng phân quyền theo vai trò

### Quyền xem công việc và công việc con

- **Admin**:
  - Xem tất cả các tasks và subtasks trong hệ thống mà không bị giới hạn bởi bất kỳ điều kiện nào.

- **Manager**:
  - Xem các tasks mà họ là người tạo (`created_by = manager_id`).
  - Xem các tasks được giao cho họ (`assigned_to = manager_id`).
  - Xem các tasks có chứa subtasks được giao cho họ.
  - Với mỗi task, chỉ có quyền xem các subtasks nếu:
    - Subtask do chính họ tạo.
    - Subtask được giao cho họ.
    - Họ là người tạo của task chính.

- **User**:
  - Xem các tasks mà họ là người tạo (`created_by = user_id`).
  - Xem các tasks được giao cho họ (`assigned_to = user_id`).
  - Xem các tasks có chứa subtasks được giao cho họ.
  - Với mỗi task, chỉ có quyền xem các subtasks nếu:
    - Subtask do chính họ tạo.
    - Subtask được giao cho họ.

### Quyền giao việc

- **Admin**: Có quyền giao việc cho tất cả các vai trò trong hệ thống (Admin, Manager, User).
- **Manager**: Có quyền giao việc cho tất cả các vai trò trong hệ thống (Admin, Manager, User).
- **User**: Không có quyền giao việc cho bất kỳ ai khác.

### Các tính năng chính

- **Xem danh sách công việc**: Hiển thị các công việc phù hợp với quyền của từng vai trò.
- **Thêm công việc mới**: Cho phép tạo công việc mới, người tạo sẽ là người sở hữu công việc.
- **Chỉnh sửa công việc**: Chỉ người có quyền liên quan mới được phép chỉnh sửa công việc.
- **Đánh dấu hoàn thành**: Đánh dấu công việc hoặc công việc con là đã hoàn thành.
- **Sắp xếp theo trạng thái/ngày**: Sắp xếp công việc dựa trên trạng thái (hoàn thành hoặc chưa hoàn thành) hoặc ngày tạo/cập nhật.
- **Phân loại theo màu (deadline)**: Mã màu các công việc dựa trên thời hạn, giúp nhận diện nhanh các công việc có thời hạn gần.
...

