import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const bookService = {
  getAllBooks: async (filters = {}) => {
    try {
      const params = {
        rating: filters.rating || undefined,
        sortBy: filters.sortBy || undefined,
        sortOrder: filters.sortOrder || undefined,
      };
      const response = await axios.get(`${API_URL}/book`, { params });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCategoryBooks: async (slugCategory, filters = {}) => {
    try {
      const params = {
        rating: filters.rating || undefined,
        sortBy: filters.sortBy || undefined,
        sortOrder: filters.sortOrder || undefined,
      };
      const response = await axios.get(`${API_URL}/book/${slugCategory}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching books for category ${slugCategory}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getBookDetail: async (slugBook) => {
    try {
      const response = await axios.get(`${API_URL}/book/detail/${slugBook}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book details for ${slugBook}:`, error);
      throw error;
    }
  },

  getFeaturedBooks: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/book/featured`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured books:", error);
      throw error;
    }
  },

  getNewBooks: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/book/new`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching new books:", error);
      throw error;
    }
  },
};

export default bookService;
