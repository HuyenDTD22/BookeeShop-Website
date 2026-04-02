import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const orderService = {
  getOrders: async (params = {}) => {
    try {
      const response = await axiosAdmin.get(`${API_URL}/${ADMIN}/order`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/order/detail/${orderId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail ${orderId}:`, error);
      throw error;
    }
  },

  ChangeStatus: async (orderId, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/order/change-status/${orderId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order status ${orderId}:`, error);
      throw error;
    }
  },

  ChangeMultiStatus: async (orderIds, status) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/order/change-multi`,
        { orderIds, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order status :`, error);
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await axiosAdmin.delete(
        `${API_URL}/${ADMIN}/order/delete/${orderId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderService;
