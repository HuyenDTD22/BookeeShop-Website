import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBell,
  FaSearch,
  FaBookOpen,
  FaHome,
  FaList,
  FaCaretDown,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaCog,
} from "react-icons/fa";
import "../../../styles/client/component/DefaultComponent.css"; // Đảm bảo import CSS
import authService from "../../../services/client/authService";
import { useNavigate } from "react-router-dom";

const HeaderComponent = ({
  cartItemCount,
  setCartItemCount,
  notificationCount,
  setNotificationCount,
  categories,
  setCategories,
}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authStatus = await authService.checkAuth();
        if (authStatus.isAuthenticated) {
          setUser(authStatus.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null); // Xóa thông tin người dùng
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Hàm render danh mục phân cấp trong một ô duy nhất
  const renderCategoryMenu = (categoryList, level = 0) => {
    const menuItems = [];

    categoryList.forEach((category, index) => {
      // Thêm ký tự "--" để thể hiện phân cấp
      const indent = "--".repeat(level);
      const displayTitle = `${indent} ${category.title}`.trimStart();

      // Thêm mục danh mục hiện tại
      menuItems.push(
        <NavDropdown.Item
          key={category._id}
          href={`/book/${category.slug}`}
          className={`category-item category-level-${level}`}
        >
          {displayTitle}
        </NavDropdown.Item>
      );

      // Nếu có children, render danh mục con với cấp độ tăng lên
      if (category.children && category.children.length > 0) {
        const childItems = renderCategoryMenu(category.children, level + 1);
        menuItems.push(...childItems);
      }

      // Thêm divider giữa các danh mục cấp 1 (nếu không phải danh mục cuối cùng)
      if (level === 0 && index < categoryList.length - 1) {
        menuItems.push(<NavDropdown.Divider key={`divider-${category._id}`} />);
      }
    });

    return menuItems;
  };

  return (
    <Navbar expand="lg" className="header-navbar" sticky="top">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          href="/"
          className="brand-logo d-flex align-items-center"
          style={{ marginLeft: "50px" }}
        >
          <FaBookOpen className="me-2" size={28} />
          <span className="fw-bold">BookeeShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          {/* Nav Links (Bên trái thanh tìm kiếm) */}
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
            style={{ marginLeft: "50px" }}
          >
            {/* Trang chủ */}
            <Nav.Link href="/" className="nav-link d-flex align-items-center">
              <FaHome className="me-1" size={18} />
              Trang chủ
            </Nav.Link>

            {/* Danh mục (Dropdown với biểu tượng và mũi tên bên phải) */}
            <NavDropdown
              title={
                <span className="d-flex align-items-center custom-dropdown-title">
                  <FaList className="me-1" size={18} />
                  Danh mục
                  <FaCaretDown className="ms-1" size={14} />
                </span>
              }
              id="dropdown-categories"
              className="nav-link"
            >
              {renderCategoryMenu(categories)}
            </NavDropdown>
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

          {/* User Actions (Bên phải thanh tìm kiếm) */}
          <Nav className="ms-auto user-actions" style={{ marginRight: "50px" }}>
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
            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center custom-dropdown-title">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="rounded-circle me-1"
                        style={{
                          width: "22px",
                          height: "22px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <FaUserCircle size={22} className="me-1" />
                    )}
                    <span className="d-none d-lg-inline">{user.fullName}</span>
                    <FaCaretDown className="ms-1" size={14} />
                  </span>
                }
                id="dropdown-user"
                className="nav-link"
              >
                <NavDropdown.Item href="/user">
                  <FaUser className="me-2" />
                  Trang cá nhân của tôi
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/user/login" className="icon-link user-icon">
                <FaUserCircle size={22} />
                <span className="ms-1 d-none d-lg-inline">Đăng nhập</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
