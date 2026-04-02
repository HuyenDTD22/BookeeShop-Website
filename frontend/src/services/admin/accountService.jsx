import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getAccounts = async (params = {}) => {
  try {
    const response = await axiosAdmin.get(`${API_URL}/${ADMIN}/account`, {
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
    const response = await axiosAdmin.get(
      `${API_URL}/${ADMIN}/account/detail/${id}`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching account detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/account/change-status/${id}`,
      {
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error changing status:", error);
    throw error;
  }
};

export const changeMulti = async (ids, key, value) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/account/change-multi`,
      { ids, key, value },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error changing multi:", error);
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await axiosAdmin.post(
      `${API_URL}/${ADMIN}/account/create`,
      accountData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const editAccount = async (id, accountData) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/account/edit/${id}`,
      accountData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axiosAdmin.delete(
      `${API_URL}/${ADMIN}/account/delete/${id}`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const editMyAccount = async (id, formData) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/account/my-account/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error editing my account:", error);
    throw error;
  }
};
