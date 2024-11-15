# Project: Quản lý Công việc

## Giới thiệu

Ứng dụng Quản lý Công việc cung cấp hệ thống quản lý công việc toàn diện với nhiều tính năng như phân quyền người dùng, quản lý công việc (tasks), thông báo deadline, lịch làm việc và đồng bộ dữ liệu từ chế độ khách. Được triển khai với các công nghệ hiện đại như React, Node.js, MySQL và Docker, ứng dụng này phù hợp cho các đội nhóm muốn quản lý tiến độ và phân công công việc hiệu quả.


## Tính năng

### 1. Quản lý Người dùng

- **Vai trò người dùng**:
  - **Admin**: Quản lý toàn bộ người dùng và công việc trong hệ thống.
  - **Manager**: Quản lý công việc của mình và các công việc được giao từ Admin.
  - **User**: Xem và quản lý các công việc được giao.

- **Hệ thống Đăng nhập/Đăng ký**:
  - Đăng ký và đăng nhập tài khoản người dùng với xác thực đầy đủ.

- **Chế độ Khách (Guest Mode)**:
  - Cho phép người dùng sử dụng ứng dụng mà không cần đăng nhập, với dữ liệu được đồng bộ khi chuyển sang tài khoản đã đăng nhập.

### 2. Quản lý Công việc

- **CRUD Công việc và Công việc con**:
  - Tạo, đọc, cập nhật, và xóa các công việc và công việc con.

- **Phân công Công việc**:
  - Phân công công việc cho người dùng cụ thể và theo dõi tiến độ.

- **Theo dõi Deadline và Trạng thái**:
  - Cập nhật và theo dõi thời hạn hoàn thành, tình trạng (chưa bắt đầu, đang tiến hành, hoàn thành, trễ hạn) của từng công việc.

- **Phân loại theo Màu dựa trên Deadline**:
  - Mã màu để phân biệt các công việc theo mức độ khẩn cấp:
    - **Màu xanh**: Công việc còn nhiều thời gian.
    - **Màu vàng**: Công việc sắp đến hạn.
    - **Màu đỏ**: Công việc gần hoặc đã trễ hạn.

### 3. Phân quyền

- **Phân quyền chi tiết theo vai trò**:
  - **Admin**: Toàn quyền chỉnh sửa và xóa mọi nội dung.
  - **Manager**: Quản lý các công việc của chính mình và các công việc được giao.
  - **User**: Chỉ xem và quản lý các công việc được giao.

### 4. Tính năng Nâng cao

- **Lịch theo dõi Công việc**:
  - Hiển thị công việc dưới dạng lịch, giúp quản lý thời gian hiệu quả hơn.

- **Thông báo qua Email**:
  - Nhắc nhở khi có công việc mới hoặc khi deadline đến gần.

- **Sắp xếp và Lọc Công việc**:
  - Tính năng sắp xếp theo ngày, trạng thái, deadline và bộ lọc theo người giao, người nhận.

- **Đồng bộ Dữ liệu từ Chế độ Khách**:
  - Khi người dùng chuyển từ chế độ Khách sang tài khoản đăng nhập, dữ liệu công việc sẽ tự động đồng bộ vào tài khoản.


## Công nghệ Sử dụng

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Triển khai**: Docker để đóng gói và triển khai dễ dàng trên mọi môi trường.

<!-- 
## Cấu trúc Dự án

TodolistApp/
├── client/                  # Frontend - React
│   ├── public/
│   └── src/
│       ├── components/      # Các components
│       │   ├── Login.js            # Component đăng nhập
│       │   ├── Register.js         # Component đăng ký
│       │   ├── TaskModal.js        # Modal thêm task
│       │   ├── EditTaskModal.js    # Modal sửa task
│       │   ├── Calendar.js         # Component lịch
│       │   └── EmailSubscription.js # Component đăng ký email
│       ├── services/               # Các services gọi API
│       │   ├── todoService.js      # Xử lý API todos
│       │   ├── userService.js      # Xử lý API users
│       │   └── localStorage.js     # Xử lý localStorage cho Guest mode
│       ├── App.js                 # Component chính
│       ├── Task.js                # Component hiển thị task
│       ├── TaskList.js            # Component danh sách tasks
│       └── AddTask.js             # Component thêm task
├── server/                       # Backend - Node.js + Express
│   └── src/
│       ├── configs/              # Cấu hình
│       │   └── database.js       # Config kết nối MySQL
│       ├── controllers/          # Xử lý logic
│       │   ├── todoController.js # Logic todos
│       │   └── userController.js # Logic users
│       ├── models/               # Tương tác database
│       │   ├── todoModel.js      # Model todos
│       │   └── userModel.js      # Model users
│       ├── routes/               # Định nghĩa routes
│       │   ├── todoRoutes.js     # Routes todos
│       │   └── userRoutes.js     # Routes users
│       ├── api.js                # Routes chính
│       ├── services/             # Services
│       │   ├── emailService.js   # Gửi email
│       │   └── cronService.js    # Jobs tự động
│       └── app.js                # Entry point
├── database/                     # MySQL
│   ├── createTable.sql           # Script tạo bảng
│   └── insertTable.sql           # Script insert dữ liệu mẫu
├── docker-compose.yml            # Cấu hình Docker
└── README.md                     # Tài liệu dự án -->


## Database Schema
```sql
-- 1. Bảng users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    email VARCHAR(255),
    email_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng todos
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE, 
    completed TINYINT(1) DEFAULT 0,
    created_by INT,
    assigned_to INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- 3. Bảng subtasks
CREATE TABLE subtasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    todo_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    assigned_to INT,
    completed BOOLEAN DEFAULT false,
    created_by INT NOT NULL,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```
--- 

## API Documentation

### Users API (/api/users)

#### Đăng ký
```http
POST /api/users/register
```
Request:
```json
{
  "username": "string",
  "password": "string",
  "role": "user|manager|admin"
}
```

#### Đăng nhập
```http
POST /api/users/login
```
Request:
```json
{
  "username": "string",
  "password": "string"
}
```

#### Lấy danh sách users
```http
GET /api/users
```

### Todos API (/api/todos)

#### Lấy danh sách todos
```http
GET /api/todos
```

#### Lấy chi tiết todo
```http
GET /api/todos/:id
```

#### Tạo todo mới
```http
POST /api/todos
```
Request:
```json
{
  "title": "string",
  "description": "string",
  "due_date": "date",
  "assigned_to": "number",
  "subtasks": [
    {
      "title": "string",
      "due_date": "date",
      "assigned_to": "number"
    }
  ]
}
```

#### Cập nhật todo
```http
PUT /api/todos/:id
```

#### Xóa todo
```http
DELETE /api/todos/:id
```

## Hướng dẫn Cài đặt và Sử dụng

1. **Di chuyển vào thư mục dự án**:
    ```bash
    cd Bai_tap_Giua_Ki
    ```

2. **Khởi động Docker Compose**:
    ```bash
    docker-compose up -d
    ```

3. **Truy cập phpMyAdmin**:
   - Đường dẫn: [localhost:8080](http://localhost:8844)
   - Tài khoản: `baitap`
   - Mật khẩu: `1`

4. **Nhập Dữ liệu Mẫu**:
   - Chọn cơ sở dữ liệu và nhập dữ liệu từ thư mục `CDSL MYSQL` trong phpMyAdmin.

5. **Chạy Server Backend**:
    - Trong terminal, di chuyển vào thư mục `server` và chạy:
    ```bash
    npm run dev
    ```

6. **Truy cập Ứng dụng**:
   - Mở trình duyệt và truy cập [localhost:3000](http://localhost:3000)
   - Đăng nhập bằng tài khoản:
     - Admin:
      + Username: admin
      + Password: 1
    - Manager:
      + Username: manager
      + Password: 1
    - User:
      + Username: user
      + Password: 1

7. **Kiểm tra Các Tính năng**:
   - Khám phá các chức năng của hệ thống quản lý công việc sau khi đăng nhập.
