import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/admin/authService";
import HeaderComponent from "./HeaderComponent";
import SideComponent from "./SiderComponent";

const ADMIN = process.env.REACT_APP_ADMIN;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response.code === 200) {
        navigate(`/${ADMIN}/auth/login`);
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <div className="d-flex">
      <SideComponent />
      <div className="flex-grow-1">
        <HeaderComponent handleLogout={handleLogout} />
        <div
          style={{
            marginLeft: "250px",
            padding: "20px",
            paddingTop: "80px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
