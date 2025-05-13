import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const commentService = {
  getComments: async (bookId, params = {}) => {
    try {
      const response = await axios.get(
        `${API_URL}/${ADMIN}/comment/${bookId}`,
        {
          params,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for book ${bookId}:`, error);
      throw error;
    }
  },

  replyComment: async (commentId, replyContent) => {
    try {
      const response = await axios.post(
        `${API_URL}/${ADMIN}/comment/reply/${commentId}`,
        { replyContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error replying to comment ${commentId}:`, error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${ADMIN}/comment/delete/${commentId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },

  deleteMultipleComments: async (commentIds) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/comment/delete-multi`,
        { commentIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting multiple comments:", error);
      throw error;
    }
  },

  deleteAllComments: async (bookId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${ADMIN}/comment/delete-all/${bookId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting all comments for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default commentService;
