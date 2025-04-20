import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const ProtectedRouteComponent = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi kiểm tra đăng nhập
  }

  if (!user) {
    return <Navigate to="/admin/auth/login" replace />; // Chuyển hướng nếu chưa đăng nhập
  }

  return children; // Render trang nếu đã đăng nhập
};

export default ProtectedRouteComponent;
