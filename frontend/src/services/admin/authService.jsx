import axiosAdmin from "../../utils/axiosAdmin";
const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.code === 200) {
        localStorage.setItem("adminToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Auth service login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/auth/logout`,
        {},
      );
      localStorage.removeItem("adminToken");
      return response.data;
    } catch (error) {
      console.error("Auth service logout error:", error);
      throw error;
    }
  },

  getAuthInfo: async () => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/auth/info`,
        {},
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/auth/password/forgot`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/auth/password/otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.code === 200) {
        localStorage.setItem("adminToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },

  resetPassword: async (password) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/auth/password/reset`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
  },
};

export default authService;
