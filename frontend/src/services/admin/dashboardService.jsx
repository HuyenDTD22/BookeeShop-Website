import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const dashboardService = {
  getDashboardStats: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/${ADMIN}/dashboard/stats`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

export default dashboardService;
