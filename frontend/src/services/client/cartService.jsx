import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const cartService = {
  // Lấy thông tin chi tiết giỏ hàng
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart details:", error);
      throw error;
    }
  },

  // Thêm sách vào giỏ hàng
  addToCart: async (slug, quantity) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add/${slug}`,
        { quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding book ${slug} to cart:`, error);
      throw error;
    }
  },

  // Xóa sách khỏi giỏ hàng
  deleteFromCart: async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/cart/delete/${bookId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting book ${bookId} from cart:`, error);
      throw error;
    }
  },

  // Cập nhật số lượng sách trong giỏ hàng
  updateQuantity: async (bookId, quantity) => {
    try {
      const response = await axios.patch(
        `${API_URL}/cart/update/${bookId}/${quantity}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating quantity for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default cartService;
