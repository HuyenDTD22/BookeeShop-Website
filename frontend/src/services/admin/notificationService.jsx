import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const notificationService = {
  getAllNotifications: async (params = {}) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/notification`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  getNotificationById: async (id) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/notification/detail/${id}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  },

  createNotification: async (data) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/notification/create`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  updateNotification: async (id, data) => {
    try {
      const response = await axiosAdmin.put(
        `${API_URL}/${ADMIN}/notification/edit/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating notification ${id}:`, error);
      throw error;
    }
  },

  updateNotificationStatus: async (id, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/notification/change-status/${id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for notification ${id}:`, error);
      throw error;
    }
  },

  updateMultipleStatuses: async (ids, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/notification/change-multi`,
        { ids, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating multiple notification statuses:", error);
      throw error;
    }
  },

  sendNotification: async (id) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/notification/send/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error sending notification ${id}:`, error);
      throw error;
    }
  },

  scheduleNotification: async (id, sendAt) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/notification/schedule/${id}`,
        { sendAt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error scheduling notification ${id}:`, error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await axiosAdmin.delete(
        `${API_URL}/${ADMIN}/notification/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },

  deleteMultipleNotifications: async (ids) => {
    try {
      const response = await axiosAdmin.delete(
        `${API_URL}/${ADMIN}/notification/delete-multi`,
        {
          data: { ids },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting multiple notifications:", error);
      throw error;
    }
  },

  getReadByUsers: async (id) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/notification/read/${id}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching read users for notification ${id}:`, error);
      throw error;
    }
  },

  getNotificationStats: async () => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/notification/stats`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      throw error;
    }
  },
};

export default notificationService;
