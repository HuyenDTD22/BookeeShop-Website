import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/login`,
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

  register: async (
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    gender,
    address
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
      const response = await axios.post(`${API_URL}/user/register`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Auth service register error:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/password/forgot`,
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
      console.error("Auth service register error:", error);
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/password/opt`,
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
      console.error("Auth service register error:", error);
      throw error;
    }
  },

  resetPassword: async (password) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/password/reset`,
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
      console.error("Auth service reset password error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Auth service logout error:", error);
      throw error;
    }
  },

  getUserInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/info`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  updateUserInfo: async (formData) => {
    try {
      const response = await axios.patch(`${API_URL}/user/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/info`, {
        withCredentials: true,
      });
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
