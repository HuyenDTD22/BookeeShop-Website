import axiosAdmin from "../../utils/axiosAdmin";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getBooks = async (params = {}) => {
  try {
    const response = await axiosAdmin.get(`${API_URL}/${ADMIN}/book`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const getBookDetail = async (id) => {
  try {
    const response = await axiosAdmin.get(
      `${API_URL}/${ADMIN}/book/detail/${id}`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/book/change-status/${id}`,
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
      `${API_URL}/${ADMIN}/book/change-multi`,
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

export const createBook = async (bookData) => {
  try {
    const response = await axiosAdmin.post(
      `${API_URL}/${ADMIN}/book/create`,
      bookData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating book:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const editBook = async (id, bookData) => {
  try {
    const response = await axiosAdmin.patch(
      `${API_URL}/${ADMIN}/book/edit/${id}`,
      bookData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error editing book:", error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axiosAdmin.delete(
      `${API_URL}/${ADMIN}/book/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
