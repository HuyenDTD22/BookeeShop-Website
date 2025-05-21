import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const bookService = {
  //   getAllBooks: async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/book`);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching all books:", error);
  //       throw error;
  //     }
  //   },

  getAllBooks: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/book`, {
        params: {
          rating: filters.rating || undefined,
          sortBy: filters.sortBy || undefined,
          sortOrder: filters.sortOrder || undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  //   getCategoryBooks: async (slugCategory) => {
  //     try {
  //       const response = await axios.get(`${API_URL}/book/${slugCategory}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error(
  //         `Error fetching books for category ${slugCategory}:`,
  //         error
  //       );
  //       throw error;
  //     }
  //   },

  getCategoryBooks: async (slugCategory, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/book/${slugCategory}`, {
        params: {
          rating: filters.rating || undefined,
          sortBy: filters.sortBy || undefined,
          sortOrder: filters.sortOrder || undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching books for category ${slugCategory}:`,
        error
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
};

export default bookService;
