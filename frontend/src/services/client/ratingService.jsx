import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ratingService = {
  getRatings: async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/rating/${bookId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ratings for book ${bookId}:`, error);
      throw error;
    }
  },

  createRating: async (ratingData) => {
    try {
      const response = await axios.post(
        `${API_URL}/rating/create`,
        ratingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw error;
    }
  },

  updateRating: async (ratingId, ratingData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/rating/update/${ratingId}`,
        ratingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating rating ${ratingId}:`, error);
      throw error;
    }
  },

  deleteRating: async (ratingId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/rating/delete/${ratingId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting rating ${ratingId}:`, error);
      throw error;
    }
  },
};

export default ratingService;
