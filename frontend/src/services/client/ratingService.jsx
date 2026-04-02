import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const ratingService = {
  getRatings: async (bookId) => {
    try {
      const response = await axiosClient.get(`${API_URL}/rating/${bookId}`, {});
      return response.data;
    } catch (error) {
      console.error(`Error fetching ratings for book ${bookId}:`, error);
      throw error;
    }
  },

  createRating: async (ratingData) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/rating/create`,
        ratingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw error;
    }
  },

  updateRating: async (ratingId, ratingData) => {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/rating/update/${ratingId}`,
        ratingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating rating ${ratingId}:`, error);
      throw error;
    }
  },

  deleteRating: async (ratingId) => {
    try {
      const response = await axiosClient.delete(
        `${API_URL}/rating/delete/${ratingId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting rating ${ratingId}:`, error);
      throw error;
    }
  },

  getUserRatings: async () => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/rating/user-ratings`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      throw error;
    }
  },
};

export default ratingService;
