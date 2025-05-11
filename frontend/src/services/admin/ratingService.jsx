import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const ratingService = {
  // Lấy danh sách đánh giá sao của một cuốn sách
  getRatings: async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/rating/${bookId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ratings for book ${bookId}:`, error);
      throw error;
    }
  },

  // Xóa tất cả đánh giá sao của một cuốn sách (xóa mềm)
  deleteAllRatings: async (bookId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/rating/delete-all/${bookId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting all ratings for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default ratingService;
