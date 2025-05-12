import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import authService from "../../../services/admin/authService";

const ADMIN = process.env.REACT_APP_ADMIN;

const HeaderComponent = ({ handleLogout }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getAuthInfo();
        if (response.code === 200) {
          setUserInfo(response.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const userDisplayName = userInfo ? userInfo.fullName || "Admin" : "Admin";
  const userAvatar = userInfo && userInfo.avatar ? userInfo.avatar : null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Nav className="ms-auto align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            {userAvatar ? (
              <Image
                src={userAvatar}
                roundedCircle
                width={30}
                height={30}
                className="me-2"
              />
            ) : (
              <FaUserCircle size={20} className="me-2" />
            )}
            {userDisplayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/${ADMIN}/my-account`}>
              Tài khoản của tôi
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default HeaderComponent;
