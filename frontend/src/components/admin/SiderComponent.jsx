import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaFolder,
  FaUsers,
  FaCog,
  FaBookOpen,
} from "react-icons/fa";

const ADMIN = process.env.REACT_APP_ADMIN;

const SiderComponent = () => {
  return (
    <div className="bg-dark text-white vh-100" style={{ width: "250px" }}>
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
          <FaHome className="me-2" /> Dashboard
        </NavLink>
        <NavLink
          to={`/${ADMIN}/book`}
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "bg-primary" : ""}`
          }
          end={true}
        >
          <FaList className="me-2" /> Danh sách sản phẩm
        </NavLink>
        <NavLink
          to={`/${ADMIN}/category`}
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "bg-primary" : ""}`
          }
          end={true}
        >
          <FaFolder className="me-2" /> Danh mục sản phẩm
        </NavLink>
        <NavLink
          to={`/${ADMIN}/permissions`}
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "bg-primary" : ""}`
          }
          end={true}
        >
          <FaUsers className="me-2" /> Phân quyền
        </NavLink>
        <NavLink
          to={`/${ADMIN}/settings`}
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? "bg-primary" : ""}`
          }
          end={true}
        >
          <FaCog className="me-2" /> Cài đặt
        </NavLink>
      </Nav>
    </div>
  );
};

export default SiderComponent;
