import axiosInstance from "./apiService";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN = process.env.REACT_APP_ADMIN;

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get(`/role`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getRoleDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/role/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching role detail:", error);
    throw error;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/role/change-status/${id}`, {
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
    const response = await axiosInstance.patch(`/role/change-multi`, {
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

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${ADMIN}/role/create`,
      roleData,
      {
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating role:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editRole = async (id, roleData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${ADMIN}/role/edit/${id}`,
      roleData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing role:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(`/role/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

export const updatePermissions = async (permissions) => {
  try {
    const response = await axiosInstance.patch(`/role/permissions`, {
      permissions,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating permissions:", error);
    throw error;
  }
};
