import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/${ADMIN}/category`, {
      withCredentials: true,
    });
    console.log("Categories received:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error.response?.data || error.message
    );
    throw error;
  }
};
