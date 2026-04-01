# 📚 BookeeShop — E-commerce Book Store Website

> **BookeeShop** là một ứng dụng web thương mại điện tử bán sách trực tuyến, bao gồm hai phân hệ chính: giao diện mua sắm dành cho khách hàng và hệ thống quản trị dành cho admin/nhân viên.

🌐 **Live Demo:** [https://bookee-shop-website.vercel.app/](https://bookee-shop-website.vercel.app/)

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Tài liệu API](#-tài-liệu-api)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Deploy](#-deploy)

---

## 🎯 Giới thiệu

**BookeeShop** là một hệ thống thương mại điện tử bán sách trực tuyến. Hệ thống được chia thành hai giao diện rõ ràng:

- **Giao diện mua sắm dành cho khách hàng (Client):** Cho phép người dùng tìm kiếm, xem chi tiết, đánh giá và mua sách trực tuyến, theo dõi trạng thái đơn hàng và nhận thông báo.
- **Giao diện quản trị dành cho Admin/Nhân viên (Admin/Staff):** Cung cấp các công cụ để quản lý toàn bộ hệ thống bao gồm sách, danh mục, đơn hàng, khách hàng, nhân viên, thông báo, nhóm quyền và phân quyền.

---

## ✨ Tính năng

### 👤 Phía Khách hàng (Client)

**Tài khoản**

- Đăng ký, đăng nhập, đăng xuất
- Quên mật khẩu (gửi email xác nhận)
- Chỉnh sửa thông tin cá nhân, đổi mật khẩu

**Duyệt & Tìm kiếm sách**

- Tìm kiếm sách theo tên, tác giả, danh mục
- Lọc sách theo số sao đánh giá
- Sắp xếp theo giá, bảng chữ cái, bán chạy nhất, đánh giá cao nhất
- Xem bình luận và đánh giá sao của từng đầu sách

**Mua hàng**

- Thêm sách vào giỏ hàng, quản lý giỏ hàng
- Đặt hàng và thanh toán qua **COD** hoặc **VNPay**
- Theo dõi trạng thái đơn hàng theo thời gian thực

**Tương tác**

- Đánh giá sao và bình luận sách sau khi mua
- Nhận thông báo cập nhật đơn hàng, khuyến mãi và thông báo hệ thống

---

### 🛠️ Phía Admin / Nhân viên

**Tài khoản**

- Đăng nhập, đăng xuất
- Chỉnh sửa thông tin cá nhân, đổi mật khẩu

**Quản lý sách**

- CRUD đầy đủ: thêm, sửa, xóa, xem danh sách sách
- Tìm kiếm theo tên, tác giả; sắp xếp theo số lượng bán, giá, chữ cái, đánh giá cao
- Lọc theo số sao
- Xem, xóa và trả lời bình luận của khách hàng

**Quản lý danh mục**

- CRUD danh mục sách
- Hỗ trợ phân cấp cha – con

**Quản lý khách hàng**

- Xem danh sách, tìm kiếm khách hàng theo tên hoặc số điện thoại

**Quản lý đơn hàng**

- Xem, cập nhật trạng thái, chỉnh sửa và xóa đơn hàng
- Tìm kiếm theo mã đơn hàng
- Lọc theo khoảng thời gian (ngày bắt đầu – ngày kết thúc)

**Quản lý thông báo**

- CRUD thông báo
- Hỗ trợ lên lịch gửi và lưu bản nháp

**Quản lý nhân viên**

- CRUD thông tin nhân viên

**Phân quyền**

- Quản lý nhóm quyền (CRUD)
- Phân quyền chi tiết: mỗi nhóm được cấp quyền thực hiện các chức năng cụ thể

---

## 🛠 Công nghệ sử dụng

### Backend

| Công nghệ    | Phiên bản | Mô tả                          |
| ------------ | --------- | ------------------------------ |
| Node.js      | 24.11.1   | Môi trường runtime             |
| Express.js   | 5.1.0     | Framework backend              |
| Mongoose     | 8.13.2    | ODM, thao tác MongoDB          |
| Cloudinary   | 2.6.0     | Lưu trữ và quản lý hình ảnh    |
| VNPay        | —         | Tích hợp thanh toán trực tuyến |
| jsonwebtoken | 9.0.2     | Tạo và xác thực JWT            |
| Swagger      | 9.0.2     | Tài liệu hóa và test API       |

### Frontend

| Công nghệ        | Phiên bản | Mô tả                              |
| ---------------- | --------- | ---------------------------------- |
| React            | 18.3.1    | Thư viện UI chính                  |
| React Router DOM | 7.4.1     | Điều hướng trang                   |
| Axios            | 1.8.4     | Gọi HTTP API                       |
| Recharts         | 2.15.3    | Biểu đồ thống kê (dashboard admin) |
| React Quill      | 2.0.0     | Trình soạn thảo văn bản            |
| React Icons      | 5.5.0     | Bộ icon phong phú                  |
| Bootstrap        | 5.3.5     | UI framework                       |

### Database & Infrastructure

| Công nghệ  | Mô tả                             |
| ---------- | --------------------------------- |
| MongoDB    | Hệ quản trị cơ sở dữ liệu quan hệ |
| MongoAtlas | Hosting database                  |
| Render     | Deploy backend                    |
| Vercel     | Deploy frontend                   |
| Cloudinary | CDN lưu trữ ảnh                   |

---

## 🏗 Kiến trúc hệ thống

Dự án áp dụng mô hình **Client – Server** với kiến trúc **Layered Architecture** phía backend:

```
    ┌─────────────────────────────────────────────────┐
    │              Frontend (ReactJS)                 │
    │ Vercel — https://bookee-shop-website.vercel.app │
    └────────────────────┬────────────────────────────┘
                         │ HTTP/REST API (JSON)
      ┌──────────────────▼──────────────────────────┐
      │            Backend (Node.js/Express)        │
      │               Render                        │
      │  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
      │  │  Router  │→ │Controller│→ │  Service  │  │
      │  └──────────┘  └──────────┘  └─────┬─────┘  │
      └────────────────────────────────────┼────────┘
                                           │ Mongoose
      ┌────────────────────────────────────▼────────┐
      │           Database (MongoDB)                │
      │                 MongoDBAtlas                │
      └─────────────────────────────────────────────┘
               │                     │
          ┌────▼─────┐          ┌────▼────┐
          │Cloudinary│          │ VNPay   │
          │  (ảnh)   │          │(thanh   │
          └──────────┘          │ toán)   │
                                └─────────┘
```

---

## 🗄 Cơ sở dữ liệu

### Các collection chính

| Collection         | Mô tả                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| `accounts`         | Thông tin tài khoản dùng cho nhân viên và admin                       |
| `users`            | Thông tin tài khoản dùng cho khách hàng                               |
| `roles`            | Nhóm quyền (USER, ADMIN, STAFF_MANAGER, STAFF_SUPPORT...)             |
| `categories`       | Danh mục sách, hỗ trợ phân cấp cha – con                              |
| `books`            | Thông tin sách (giá, tác giả, NXB, tồn kho, ảnh bìa...)               |
| `carts`            | Giỏ hàng, mỗi khách hàng có một giỏ duy nhất                          |
| `orders`           | Đơn hàng, bao gồm thông tin thanh toán (COD / VNPay) và trạng thái    |
| `ratings`          | Đánh giá sao của khách hàng cho từng đầu sách                         |
| `comments`         | Bình luận của khách hàng, hỗ trợ trả lời dạng thread (parent – child) |
| `reacts`           | Phản hồi cảm xúc bình luận                                            |
| `notifications`    | Thông báo hệ thống, đơn hàng và khuyến mãi                            |
| `forgot_passwords` | Lưu OTP xác thực cho chức năng quên mật khẩu                          |

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu môi trường

- Node.js 24+
- MongoDB

### 1. Clone dự án

```bash
git clone <repo-url>
```

### 2. Cấu hình Backend

Tạo file `.env` trong thư mục `backend`:

```env
PORT=3000

MONGO_URL=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

JWT_SECRET=your_jwt_secret_key

FRONTEND_URL=http://localhost:3001
```

```bash
cd backend
npm install
npm run dev     # môi trường development (nodemon)
# hoặc
npm start       # môi trường production
```

Backend sẽ chạy tại: `http://localhost:3000`

### 3. Cấu hình Frontend

Tạo file `.env` trong thư mục `frontend`:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ADMIN=admin
```

Chạy frontend:

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: `http://localhost:3001`

---

## 📁 Cấu trúc thư mục

### Backend

```
backend/
├── config/                # Cấu hình hệ thống
├──  controllers/          # Xử lý logic request/response
├── helpers/               # Các hàm tiện ích dùng chung
├── middlewares/           # Middleware(auth, kiểm tra quyền,..)
├── models/                # Định nghĩa schema MongoDB
├── routes/                # Khai báo các API routes
├── validates/             # Validate dữ liệu đầu vào
├── .env                   # Biến môi trường
├── index.js               # Entry point, khởi tạo server Express
├── package-lock.json      # Quản lý version dependency
└── package.json/          # Thông tin project & danh sách dependencies
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── components/      # Các component dùng chung
│   ├── context/         # React Context (Auth, Cart...)
│   ├── pages/           # Các trang (Client & Admin)
│   ├── routes/          # Cấu hình route
│   ├── services/        # Gọi API (Axios)
|   ├── styles/          # File CSS
│   ├── utils/           # Hàm tiện ích
│   └── App.js           # Entry point React app
├── .env
└── package.json
```

---

## 📖 Tài liệu API

Dự án sử dụng Swagger (swagger-jsdoc, swagger-ui-express) để xây dựng và hiển thị tài liệu API.

Các endpoint được mô tả bằng Swagger annotations trực tiếp trong các file routes.

Sau khi chạy backend, truy cập Swagger UI tại:

```
http://localhost:3000/api-docs/
```

---

## 🧭 Hướng dẫn sử dụng

### Truy cập hệ thống

| Phân hệ              | Đường dẫn                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Giao diện khách hàng | [https://bookee-shop-website.vercel.app](https://bookee-shop-website.vercel.app)             |
| Giao diện quản trị   | [https://bookee-shop-website.vercel.app/admin](https://bookee-shop-website.vercel.app/admin) |

### Luồng sử dụng chính

**Khách hàng:**

1. Truy cập trang chủ → Tìm kiếm sách
2. Đăng ký / Đăng nhập tài khoản
3. Thêm sách vào giỏ hàng → Tiến hành đặt hàng
4. Chọn phương thức thanh toán: **COD** hoặc **VNPay**
5. Theo dõi trạng thái đơn hàng trong trang cá nhân
6. Đánh giá sách sau khi nhận hàng

**Admin/Nhân viên:**

1. Đăng nhập vào hệ thống quản trị
2. Quản lý sách, danh mục, đơn hàng, thông báo, khách hàng theo phân quyền được cấp
3. Gửi thông báo đến khách hàng (có thể đặt lịch)
4. Xem thống kê doanh thu, sô lượng đơn hàng, khách hàng, sách,...

---

## ☁️ Deploy

| Thành phần    | Platform                                 |
| ------------- | ---------------------------------------- |
| Frontend      | [Vercel](https://vercel.com/)            |
| Backend       | [Render](https://render.com/)            |
| Database      | [MongoDBAtlas](https://www.mongodb.com/) |
| Image Storage | [Cloudinary](https://cloudinary.com/)    |

---
