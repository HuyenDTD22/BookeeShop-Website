import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const userService = {
  getUsers: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/user`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserDetail: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/user/detail/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user detail ${userId}:`, error);
      throw error;
    }
  },

  changeStatus: async (userId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/user/change-status/${userId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user status ${userId}:`, error);
      throw error;
    }
  },

  changeMultiStatus: async (userIds, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/user/change-multi`,
        { userIds, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating multiple user status:`, error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${ADMIN}/user/delete/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },
};

export default userService;
