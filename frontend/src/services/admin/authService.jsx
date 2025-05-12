import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const authService = {
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

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/auth/password/forgot`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/auth/password/otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },

  resetPassword: async (password) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/auth/password/reset`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },
};

export default authService;
