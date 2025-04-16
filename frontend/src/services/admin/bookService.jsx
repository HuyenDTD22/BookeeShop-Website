import axiosInstance from "./apiService";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getBooks = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/${ADMIN}/book`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const getBookDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/book/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/book/change-status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing status:", error);
    throw error;
  }
};

export const changeMulti = async (ids, key, value) => {
  try {
    const response = await axiosInstance.patch(`/book/change-multi`, {
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

export const createBook = async (bookData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${ADMIN}/book/create`,
      bookData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log("Create book response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating book:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editBook = async (id, bookData) => {
  try {
    const response = await axiosInstance.patch(`/book/edit/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error("Error editing book:", error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axiosInstance.delete(`/book/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
