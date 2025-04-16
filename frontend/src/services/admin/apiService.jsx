import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

// Tạo instance của axios với cấu hình chung
const axiosInstance = axios.create({
  baseURL: `${API_URL}/${ADMIN}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// // Thêm interceptor để xử lý lỗi chung (nếu cần)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Nếu lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
//       window.location.href = `/${ADMIN}/auth/login`;
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
