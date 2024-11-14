## Cấu trúc project

project/
├── client/                  # Frontend - React
│   └── src/
│       ├── components/
│       │   ├── Login.js     # Đăng nhập
│       │   ├── Register.js  # Đăng ký
│       │   ├── TaskModal.js # Thêm task
│       │   └── EditTaskModal.js # Sửa task
│       ├── services/
│       │   ├── todoService.js # API todos
│       │   └── userService.js # API users
│       ├── AddTask.js      # Component thêm task
│       ├── App.js          # Component chính
│       ├── Task.js         # Hiển thị task
│       └── TaskList.js     # List tasks
│
├── server/                  # Backend - Node.js + Express
│   └── src/
│       ├── configs/
│       │   └── database.js  # Config MySQL
│       ├── controllers/
│       │   ├── todoController.js # Logic todos
│       │   └── userController.js # Logic users
│       ├── models/
│       │   ├── todoModel.js # DB todos
│       │   └── userModel.js # DB users
│       ├── routes/
│       │   ├── todoRoutes.js # Routes todos
│       │   └── userRoutes.js # Routes users
│       └── app.js           # Entry point
│
└── database/               # MySQL
    ├── createTable.sql    # Schema
    └── insertTable.sql    # Sample data

## API Endpoints

   /api/users
     POST /register
     POST /login
     GET /
   
   /api/todos
     GET /
     GET /:id
     POST /
     PUT /:id
     DELETE /:id

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

5. Trong terminal, di chuyển vào thư mục `server` và chạy lệnh: 
    ```bash
    npm run dev
    ```

6. Mở trình duyệt và truy cập [localhost:3000](http://localhost:3000):
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

