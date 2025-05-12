import axiosInstance from "./apiService";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getAccounts = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`/account`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const getAccountDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/account/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/account/change-status/${id}`, {
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
    const response = await axiosInstance.patch(`/account/change-multi`, {
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

export const createAccount = async (accountData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${ADMIN}/account/create`,
      accountData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          //   Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editAccount = async (id, accountData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${ADMIN}/account/edit/${id}`,
      accountData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${ADMIN}/account/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const editMyAccount = async (id, formData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${ADMIN}/account/my-account/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing my account:", error);
    throw error;
  }
};
