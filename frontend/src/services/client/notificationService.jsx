import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/notification`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Lấy danh sách thông báo thất bại!"
      );
    }
  },

  getNotificationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/notification/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching notification ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Lấy chi tiết thông báo thất bại!"
      );
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axios.patch(
        `${API_URL}/notification/${id}/read`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error marking notification ${id} as read:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Đánh dấu thông báo đã đọc thất bại!"
      );
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/notification/unread-count`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching unread notification count:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Lấy số lượng thông báo chưa đọc thất bại!"
      );
    }
  },
};

export default notificationService;
