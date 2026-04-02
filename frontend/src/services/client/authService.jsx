import axiosClient from "../../utils/axiosClient";
const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/user/login`,
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
        localStorage.setItem("clientToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Auth service login error:", error);
      throw error;
    }
  },

  register: async (
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    gender,
    address,
  ) => {
    try {
      const payload = {
        fullName,
        email,
        password,
        confirmPassword,
        phone,
        gender,
        address,
      };
      const response = await axiosClient.post(
        `${API_URL}/user/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.code === 200) {
        localStorage.setItem("clientToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Auth service register error:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/user/password/forgot`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Auth service forgot password error:", error);
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/user/password/otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.code === 200) {
        localStorage.setItem("clientToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Auth service verify OTP error:", error);
      throw error;
    }
  },

  resetPassword: async (password) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/user/password/reset`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Auth service reset password error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosClient.post(`${API_URL}/user/logout`, {}, {});
      localStorage.removeItem("clientToken");
      return response.data;
    } catch (error) {
      console.error("Auth service logout error:", error);
      throw error;
    }
  },

  getUserInfo: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/user/info`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  updateUserInfo: async (formData) => {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/user/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/user/info`, {});
      return {
        isAuthenticated: response.data.code === 200,
        user: response.data.info,
      };
    } catch (error) {
      console.error("Error checking auth status:", error);
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  },
};

export default authService;
