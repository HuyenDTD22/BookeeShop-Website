import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const ratingService = {
  getRatings: async (bookId) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/rating/${bookId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching ratings for book ${bookId}:`, error);
      throw error;
    }
  },

  deleteAllRatings: async (bookId) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/rating/delete-all/${bookId}`,
        {},
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting all ratings for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default ratingService;
