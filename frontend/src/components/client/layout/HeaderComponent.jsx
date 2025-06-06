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
  Modal,
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
} from "react-icons/fa";
import "../../../styles/client/component/DefaultComponent.css";
import authService from "../../../services/client/authService";
import homeService from "../../../services/client/homeService";
import notificationService from "../../../services/client/notificationService";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CartItemCountComponent from "../cart/CartItemCountComponent";

const HeaderComponent = ({
  notificationCount,
  setNotificationCount,
  categories,
  setCategories,
}) => {
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authStatus = await authService.checkAuth();
        if (authStatus.isAuthenticated) {
          setUser(authStatus.user);
          // Fetch unread notifications count
          try {
            const response = await notificationService.getUnreadCount();
            setNotificationCount(response.data.unreadCount || 0);
          } catch (error) {
            console.error("Error fetching unread notifications count:", error);
            setNotificationCount(0);
          }
        } else {
          setUser(null);
          setNotificationCount(0);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setNotificationCount(0);
      }
    };
    fetchUserInfo();
  }, [setNotificationCount]);

  const handleSearch = async (keyword) => {
    try {
      const response = await homeService.searchBooks(keyword);
      if (response.code === 200) {
        setSearchResults(response.books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleSearch(searchKeyword);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchKeyword]);

  useEffect(() => {
    setSearchResults([]);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchKeyword);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setNotificationCount(0);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const checkAuthAndNavigate = async (path) => {
    const authStatus = await authService.checkAuth();
    if (authStatus.isAuthenticated) {
      navigate(path);
    } else {
      setShowLoginModal(true);
    }
  };

  const renderCategoryMenu = (categoryList, level = 0) => {
    const menuItems = [];
    categoryList.forEach((category, index) => {
      const indent = "--".repeat(level);
      const displayTitle = `${indent} ${category.title}`.trimStart();
      menuItems.push(
        <NavDropdown.Item
          key={category._id}
          href={`/book/${category.slug}`}
          className={`category-item category-level-${level}`}
        >
          {displayTitle}
        </NavDropdown.Item>
      );
      if (category.children && category.children.length > 0) {
        const childItems = renderCategoryMenu(category.children, level + 1);
        menuItems.push(...childItems);
      }
      if (level === 0 && index < categoryList.length - 1) {
        menuItems.push(<NavDropdown.Divider key={`divider-${category._id}`} />);
      }
    });
    return menuItems;
  };

  return (
    <Navbar expand="lg" className="header-navbar" sticky="top">
      <Container fluid>
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
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
            style={{ marginLeft: "50px" }}
          >
            <Nav.Link href="/" className="nav-link d-flex align-items-center">
              <FaHome className="me-1" size={18} />
              Trang chủ
            </Nav.Link>
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
          <Form className="d-flex search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <FormControl
                type="text"
                placeholder="Tìm kiếm sách..."
                className="search-input"
                aria-label="Search"
                value={searchKeyword}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchKeyword(newValue);
                  if (newValue === "") {
                    setSearchResults([]);
                  }
                }}
              />
              <Button variant="link" className="search-button" type="submit">
                <FaSearch />
              </Button>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((book) => (
                    <Link
                      to={`/book/detail/${book.slug}`}
                      key={book._id}
                      className="search-result-item"
                    >
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="search-result-image"
                      />
                      <div className="search-result-info">
                        <div className="search-result-title">{book.title}</div>
                        <div className="search-result-author">
                          Tác giả: {book.author || "Không có thông tin"}
                        </div>
                        <div className="search-result-supplier">
                          Nhà sản xuất: {book.supplier || "Không có thông tin"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Form>
          <Nav className="ms-auto user-actions" style={{ marginRight: "50px" }}>
            <Nav.Link
              onClick={() => checkAuthAndNavigate("/notifications")}
              className="icon-link position-relative"
            >
              <FaBell size={20} />
              {notificationCount > 0 && (
                <Badge pill bg="danger" className="notification-badge">
                  {notificationCount}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link
              onClick={() => checkAuthAndNavigate("/cart")}
              className="icon-link position-relative"
            >
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <Badge pill bg="danger" className="notification-badge">
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>
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
        <CartItemCountComponent setCartItemCount={setCartItemCount} />
      </Container>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn cần đăng nhập hoặc đăng ký tài khoản để sử dụng tính năng này!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/user/login")}>
            Đăng nhập
          </Button>
          <Button variant="primary" onClick={() => navigate("/user/register")}>
            Đăng ký
          </Button>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default HeaderComponent;
