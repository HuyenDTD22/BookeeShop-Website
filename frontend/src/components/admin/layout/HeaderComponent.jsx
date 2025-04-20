// src/components/admin/HeaderComponent/HeaderComponent.jsx
import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle, FaBookOpen } from "react-icons/fa";

const HeaderComponent = ({ handleLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Nav className="ms-auto align-items-center">
        <Nav.Link>
          <FaBell size={20} color="white" />
        </Nav.Link>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            <FaUserCircle size={20} /> Admin
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default HeaderComponent;
