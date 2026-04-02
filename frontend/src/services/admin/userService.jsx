import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const userService = {
  getUsers: async (params = {}) => {
    try {
      const response = await axiosAdmin.get(`${API_URL}/${ADMIN}/user`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserDetail: async (userId) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/user/detail/${userId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching user detail ${userId}:`, error);
      throw error;
    }
  },

  changeStatus: async (userId, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/user/change-status/${userId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user status ${userId}:`, error);
      throw error;
    }
  },

  changeMultiStatus: async (userIds, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/user/change-multi`,
        { userIds, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating multiple user status:`, error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosAdmin.delete(
        `${API_URL}/${ADMIN}/user/delete/${userId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },
};

export default userService;
