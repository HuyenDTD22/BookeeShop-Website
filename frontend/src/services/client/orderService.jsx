import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const orderService = {
  getCartForCheckout: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/order`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching cart for order:", error);
      throw error;
    }
  },

  buyNow: async (data) => {
    try {
      const response = await axiosClient.post(`${API_URL}/order/create`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating buy-now order:", error);
      throw error;
    }
  },

  createVnpayOrder: async (data) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/order/create-vnpay`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating VNPay order:", error);
      throw error;
    }
  },

  getOrderSuccess: async (orderId) => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/order/success/${orderId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order success ${orderId}:`, error);
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/order/my-orders`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching my orders:", error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/order/detail/${orderId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail ${orderId}:`, error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/order/cancel/${orderId}`,
        {},
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderService;
