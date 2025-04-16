import React, { useState } from "react";
import HeaderComponent from "./HeaderComponent";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  Badge,
} from "react-bootstrap";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBell,
  FaSearch,
  FaHeart,
  FaBookOpen,
} from "react-icons/fa";
import "../../assets/styles/DefaultComponent.css";

const DefaultComponent = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(5);
  const [notificationCount, setNotificationCount] = useState(3);
  return (
    <Navbar expand="lg" className="header-navbar" sticky="top">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/" className="brand-logo d-flex align-items-center">
          <FaBookOpen className="me-2" size={28} />
          <span className="fw-bold">BookeeShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          {/* Nav Links - Categories */}
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/category/fiction" className="nav-link">
              Sách Tiểu Thuyết
            </Nav.Link>
            <Nav.Link href="/category/science" className="nav-link">
              Khoa Học
            </Nav.Link>
            <Nav.Link href="/category/children" className="nav-link">
              Thiếu Nhi
            </Nav.Link>
            <Nav.Link href="/category/textbook" className="nav-link">
              Giáo Khoa
            </Nav.Link>
            <Nav.Link href="/bestsellers" className="nav-link">
              Sách Bán Chạy
            </Nav.Link>
          </Nav>

          {/* Search Box */}
          <Form className="d-flex search-form">
            <div className="search-input-container">
              <FormControl
                type="search"
                placeholder="Tìm kiếm sách..."
                className="search-input"
                aria-label="Search"
              />
              <Button variant="link" className="search-button">
                <FaSearch />
              </Button>
            </div>
          </Form>

          {/* User Actions */}
          <Nav className="ms-auto user-actions">
            {/* Wishlist */}
            <Nav.Link href="/wishlist" className="icon-link">
              <FaHeart size={20} />
            </Nav.Link>

            {/* Notifications */}
            <Nav.Link
              href="/notifications"
              className="icon-link position-relative"
            >
              <FaBell size={20} />
              {notificationCount > 0 && (
                <Badge pill bg="danger" className="notification-badge">
                  {notificationCount}
                </Badge>
              )}
            </Nav.Link>

            {/* Shopping Cart */}
            <Nav.Link href="/cart" className="icon-link position-relative">
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <Badge pill bg="danger" className="notification-badge">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>

            {/* User Account */}
            <Nav.Link href="/user/login" className="icon-link user-icon">
              <FaUserCircle size={22} />
              <span className="ms-1 d-none d-lg-inline">Đăng nhập</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DefaultComponent;
