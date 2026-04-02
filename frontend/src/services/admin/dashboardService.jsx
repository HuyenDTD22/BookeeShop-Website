import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

const dashboardService = {
  getDashboardStats: async (params = {}) => {
    try {
      const response = await axiosAdmin.get(
        `${API_URL}/${ADMIN}/dashboard/stats`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

export default dashboardService;
