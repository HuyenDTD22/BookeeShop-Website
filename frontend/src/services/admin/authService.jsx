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

  //   //Đăng ký
  //   register: async (
  //     fullName,
  //     email,
  //     password,
  //     confirmPassword,
  //     phone,
  //     gender
  //   ) => {
  //     try {
  //       const payload = {
  //         fullName,
  //         email,
  //         password,
  //         confirmPassword,
  //         phone,
  //         gender,
  //       };
  //       const response = await axios.post(`${API_URL}/user/register`, payload, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       });

  //       return response.data;
  //     } catch (error) {
  //       console.error("Auth service register error:", error);
  //       throw error;
  //     }
  //   },

  //   //Quên mật khẩu
  //   forgotPassword: async (email) => {
  //     try {
  //       const response = await axios.post(
  //         `${API_URL}/user/password/forgot`,
  //         { email },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           withCredentials: true,
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Auth service register error:", error);
  //       throw error;
  //     }
  //   },

  //   //xác nhận otp
  //   verifyOtp: async (email, otp) => {
  //     try {
  //       const response = await axios.post(
  //         `${API_URL}/user/password/opt`,
  //         { email, otp },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           withCredentials: true,
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Auth service register error:", error);
  //       throw error;
  //     }
  //   },

  //Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },

  // Kiểm tra người dùng đã đăng nhập chưa
  isLoggedIn: () => {
    return (
      !!localStorage.getItem("token") || !!authService.getTokenFromCookie()
    );
  },

  // Lấy token từ cookie nếu có
  getTokenFromCookie: () => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();

      if (trimmedCookie.startsWith("token=")) {
        return trimmedCookie.substring("token=".length);
      }
    }
    return null;
  },

  // Lấy token từ localStorage hoặc cookie
  getToken: () => {
    return localStorage.getItem("token") || authService.getTokenFromCookie();
  },
};

export default authService;
