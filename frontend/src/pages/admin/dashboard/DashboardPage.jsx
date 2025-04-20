import React from "react";
import HeaderComponent from "../../../components/admin/layout/HeaderComponent";
import SiderComponent from "../../../components/admin/layout/SiderComponent";

const DashboardPage = () => {
  const handleLogout = () => {
    console.log("Đăng xuất");
    // Xử lý đăng xuất (xóa token, chuyển hướng)
  };

  return <div>DashboardPage</div>;
};

export default DashboardPage;
