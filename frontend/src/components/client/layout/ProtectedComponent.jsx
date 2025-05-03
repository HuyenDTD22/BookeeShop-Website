import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextClient } from "../../../scontext/AuthContextClient";

const ProtectedComponent = ({ onAction, children }) => {
  const { isAuthenticated, loading } = useContext(AuthContextClient);
  const navigate = useNavigate();

  const handleAction = () => {
    if (loading) {
      return; // Đợi kiểm tra đăng nhập hoàn tất
    }

    if (!isAuthenticated) {
      navigate("/user/login");
      return;
    }

    onAction(); // Thực hiện hành động nếu đã đăng nhập
  };

  return (
    <div onClick={handleAction} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
};

export default ProtectedComponent;
