import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const authService = {
  //Đăng nhập
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Auth service login error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/auth/logout`, {
        withCredentials: true, // Gửi cookie trong request
      });
      return response.data;
    } catch (error) {
      console.error("Auth service logout error:", error);
      throw error;
    }
  },

  //   //Đăng xuất
  //   logout: () => {
  //     localStorage.removeItem("token");
  //     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //   },

  //   // Kiểm tra người dùng đã đăng nhập chưa
  //   isLoggedIn: () => {
  //     return (
  //       !!localStorage.getItem("token") || !!authService.getTokenFromCookie()
  //     );
  //   },

  //   // Lấy token từ cookie nếu có
  //   getTokenFromCookie: () => {
  //     const cookies = document.cookie.split(";");

  //     for (const cookie of cookies) {
  //       const trimmedCookie = cookie.trim();

  //       if (trimmedCookie.startsWith("token=")) {
  //         return trimmedCookie.substring("token=".length);
  //       }
  //     }
  //     return null;
  //   },

  //   // Lấy token từ localStorage hoặc cookie
  //   getToken: () => {
  //     return localStorage.getItem("token") || authService.getTokenFromCookie();
  //   },
};

export default authService;
