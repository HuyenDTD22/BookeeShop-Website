import React from "react";
import HeaderComponent from "./HeaderComponent";
import SideComponent from "./SiderComponent";

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    console.log("Đăng xuất");
    // Xử lý đăng xuất (xóa token, chuyển hướng)
  };

  return (
    <div className="d-flex">
      <SideComponent />
      <div className="flex-grow-1">
        <HeaderComponent handleLogout={handleLogout} />
        {children} {/* Nội dung của trang admin sẽ được render ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
