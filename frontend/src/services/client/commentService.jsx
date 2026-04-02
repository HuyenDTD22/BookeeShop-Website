import axiosClient from "../../utils/axiosClient";

const API_URL = process.env.REACT_APP_API_URL;

const commentService = {
  getComments: async (bookId) => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/comment/${bookId}`,
        {},
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for book ${bookId}:`, error);
      throw error;
    }
  },

  createComment: async (commentData) => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/comment/create`,
        commentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  deleteComment: async (commentId, bookId) => {
    try {
      const response = await axiosClient.delete(
        `${API_URL}/comment/delete/${commentId}`,
        {
          params: { bookId },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },
};

export default commentService;
