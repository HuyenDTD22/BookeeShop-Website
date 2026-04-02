import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const commentService = {
  getComments: async (bookId, params = {}) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/comment/${bookId}`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for book ${bookId}:`, error);
      throw error;
    }
  },

  replyComment: async (commentId, replyContent) => {
    try {
      const response = await axiosAdmin.post(
        `${API_URL}/${ADMIN}/comment/reply/${commentId}`,
        { replyContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error replying to comment ${commentId}:`, error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await axiosAdmin.delete(
        `${API_URL}/${ADMIN}/comment/delete/${commentId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },

  deleteMultipleComments: async (commentIds) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/comment/delete-multi`,
        { commentIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting multiple comments:", error);
      throw error;
    }
  },

  deleteAllComments: async (bookId) => {
    try {
      const response = await axiosAdmin.patch(
        `${API_URL}/${ADMIN}/comment/delete-all/${bookId}`,
        {},
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting all comments for book ${bookId}:`, error);
      throw error;
    }
  },
};

export default commentService;
