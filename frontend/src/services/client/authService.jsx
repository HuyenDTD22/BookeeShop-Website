import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  //Đăng nhập
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

  //Đăng ký
  register: async (
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    gender
  ) => {
    try {
      const payload = {
        fullName,
        email,
        password,
        confirmPassword,
        phone,
        gender,
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

  //Quên mật khẩu
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

  //xác nhận otp
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

  // Lấy thông tin user
  getUserInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/info`, {
        withCredentials: true,
      });
      return response.data; // Trả về trực tiếp response.data
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error; // Ném lỗi để xử lý ở tầng trên
    }
  },

  //Cập nhật thông tin người dùng
  updateUserInfo: async (data) => {
    try {
      const response = await axios.patch(`${API_URL}/user/info`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  },

  // Kiểm tra trạng thái đăng nhập
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
