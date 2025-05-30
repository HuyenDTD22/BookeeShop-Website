import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaFolder,
  FaUserShield,
  FaUserFriends,
  FaUsers,
  FaCog,
  FaBookOpen,
  FaShoppingCart,
  FaStar,
  FaBell,
} from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const SiderComponent = () => {
  const { hasPermission } = useContext(AuthContext);

  return (
    <div
      className="bg-dark text-white position-fixed"
      style={{
        width: "250px",
        height: "100vh",
        overflowY: "auto",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div className="p-3">
        <Navbar.Brand
          href={`/${ADMIN}`}
          className="brand-logo d-flex align-items-center"
        >
          <FaBookOpen className="me-2" size={30} color="white" />
          <span
            className="fw-bold"
            style={{ color: "white", fontSize: "25px" }}
          >
            BookeeShop
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
      </div>
      <Nav className="flex-column">
        <NavLink
          to={`/${ADMIN}`}
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "bg-primary" : ""}`
          }
          end={true}
        >
          <FaHome className="me-2" /> Tổng quan
        </NavLink>
        {hasPermission("read_books") && (
          <NavLink
            to={`/${ADMIN}/book`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaList className="me-2" /> Danh sách sản phẩm
          </NavLink>
        )}
        {hasPermission("read_categories") && (
          <NavLink
            to={`/${ADMIN}/category`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaFolder className="me-2" /> Danh mục sản phẩm
          </NavLink>
        )}
        {hasPermission("read_users") && (
          <NavLink
            to={`/${ADMIN}/user`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaUsers className="me-2" /> Quản lý khách hàng
          </NavLink>
        )}
        {hasPermission("read_orders") && (
          <NavLink
            to={`/${ADMIN}/order`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaShoppingCart className="me-2" /> Quản lý đơn hàng
          </NavLink>
        )}
        {hasPermission("read_reviews") && (
          <NavLink
            to={`/${ADMIN}/reviews`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaStar className="me-2" /> Quản lý đánh giá
          </NavLink>
        )}
        {hasPermission("read_notifications") && (
          <NavLink
            to={`/${ADMIN}/notification`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaBell className="me-2" /> Quản lý thông báo
          </NavLink>
        )}
        {hasPermission("read_accounts") && (
          <NavLink
            to={`/${ADMIN}/account`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaUserFriends className="me-2" /> Quản lý nhân sự
          </NavLink>
        )}
        {hasPermission("read_roles") && (
          <NavLink
            to={`/${ADMIN}/role`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaUserShield className="me-2" /> Nhóm quyền
          </NavLink>
        )}
        {hasPermission("roles_permissions") && (
          <NavLink
            to={`/${ADMIN}/role/permissions`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaUsers className="me-2" /> Phân quyền
          </NavLink>
        )}
        {hasPermission("settings_view") && (
          <NavLink
            to={`/${ADMIN}/settings`}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-primary" : ""}`
            }
            end={true}
          >
            <FaCog className="me-2" /> Cài đặt
          </NavLink>
        )}
      </Nav>
    </div>
  );
};

export default SiderComponent;
