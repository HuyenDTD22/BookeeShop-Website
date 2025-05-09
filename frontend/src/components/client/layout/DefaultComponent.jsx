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
  FaHeart,
  FaBookOpen,
} from "react-icons/fa";
import { api } from "../../../services/client/bookService";
import "../../../styles/client/component/DefaultComponent.css";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent"; // Nhập HeaderComponent

const DefaultComponent = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(5);
  const [notificationCount, setNotificationCount] = useState(3);
  const [categories, setCategories] = useState([]);

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getHomepage();
        setCategories(data.layoutCategory || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <HeaderComponent
        cartItemCount={cartItemCount}
        setCartItemCount={setCartItemCount}
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
        categories={categories}
        setCategories={setCategories}
      />
      <main>{children}</main>
      <FooterComponent />
    </>
  );
};

export default DefaultComponent;
