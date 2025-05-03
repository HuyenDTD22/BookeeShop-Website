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

  // Kiểm tra đăng nhập và lấy thông tin user
  getAuthInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/auth/info`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
