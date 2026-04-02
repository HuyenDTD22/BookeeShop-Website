import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const homeService = {
  getHomepage: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      throw error;
    }
  },

  searchBooks: async (keyword) => {
    try {
      const response = await axiosClient.get(`${API_URL}/search`, {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  },
};

export default homeService;
