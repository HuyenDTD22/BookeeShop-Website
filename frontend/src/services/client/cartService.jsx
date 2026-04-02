import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const cartService = {
  getCart: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/cart`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching cart details:", error);
      throw error;
    }
  },

  addToCart: async (slug, quantity) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/cart/add/${slug}`,
        { quantity },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding book ${slug} to cart:`, error);
      throw error;
    }
  },

  deleteFromCart: async (bookId) => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/cart/delete/${bookId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting book ${bookId} from cart:`, error);
      throw error;
    }
  },

  updateQuantity: async (bookId, quantity) => {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/cart/update/${bookId}`,
        { quantity },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating quantity for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default cartService;
