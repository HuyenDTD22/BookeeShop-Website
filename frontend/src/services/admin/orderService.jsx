import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const orderService = {
  getOrders: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/order`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/order/detail/${orderId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail ${orderId}:`, error);
      throw error;
    }
  },

  ChangeStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/order/change-status/${orderId}`,
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
      console.error(`Error updating order status ${orderId}:`, error);
      throw error;
    }
  },

  ChangeMultiStatus: async (orderIds, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/order/change-multi`,
        { orderIds, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order status :`, error);
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${ADMIN}/order/delete/${orderId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderService;
