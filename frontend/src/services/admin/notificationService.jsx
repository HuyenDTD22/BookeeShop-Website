import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const notificationService = {
  // Lấy danh sách tất cả thông báo
  getAllNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/notification`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Lấy chi tiết một thông báo
  getNotificationById: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/notification/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  },

  // Tạo thông báo mới
  createNotification: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/notification`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Cập nhật thông báo
  updateNotification: async (id, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/${ADMIN}/notification/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating notification ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật trạng thái một thông báo
  updateNotificationStatus: async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/notification/${id}`,
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
      console.error(`Error updating status for notification ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật trạng thái nhiều thông báo
  updateMultipleStatuses: async (ids, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/notification/change-multi`,
        { ids, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating multiple notification statuses:", error);
      throw error;
    }
  },

  // Gửi thông báo ngay lập tức
  sendNotification: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/notification/send/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error sending notification ${id}:`, error);
      throw error;
    }
  },

  // Lên lịch gửi thông báo
  scheduleNotification: async (id, sendAt) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/notification/schedule/${id}`,
        { sendAt },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error scheduling notification ${id}:`, error);
      throw error;
    }
  },

  // Xóa một thông báo
  deleteNotification: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${ADMIN}/notification/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },

  // Xóa nhiều thông báo
  deleteMultipleNotifications: async (ids) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${ADMIN}/notification/change-multi`,
        {
          data: { ids },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting multiple notifications:", error);
      throw error;
    }
  },

  // Lấy danh sách người dùng đã đọc thông báo
  getReadByUsers: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/notification/read/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching read users for notification ${id}:`, error);
      throw error;
    }
  },

  // Lấy thống kê thông báo
  getNotificationStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/notification/stats`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      throw error;
    }
  },
};

export default notificationService;
