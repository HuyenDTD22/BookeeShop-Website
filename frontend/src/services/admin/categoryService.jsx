import axios from "axios";
import axiosInstance from "./apiService";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getCategory = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/${ADMIN}/category`, {
      params,
      withCredentials: true,
    });
    console.log("Categories response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCategoryDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/category/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(
      `/category/change-status/${id}`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing status:", error);
    throw error;
  }
};

export const changeMulti = async (ids, key, value) => {
  try {
    const response = await axiosInstance.patch(`/category/change-multi`, {
      ids,
      key,
      value,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing multi:", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${ADMIN}/category/create`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const editCategory = async (id, categoryData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${ADMIN}/category/edit/${id}`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${ADMIN}/category/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
