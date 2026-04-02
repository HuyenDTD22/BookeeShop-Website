import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/notification`, {});
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Lấy danh sách thông báo thất bại!",
      );
    }
  },

  getNotificationById: async (id) => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/notification/detail/${id}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching notification ${id}:`,
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Lấy chi tiết thông báo thất bại!",
      );
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/notification/${id}/read`,
        {},
        {},
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error marking notification ${id} as read:`,
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Đánh dấu thông báo đã đọc thất bại!",
      );
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/notification/unread-count`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching unread notification count:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          "Lấy số lượng thông báo chưa đọc thất bại!",
      );
    }
  },
};

export default notificationService;
