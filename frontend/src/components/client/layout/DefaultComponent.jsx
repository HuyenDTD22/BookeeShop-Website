import React, { useState, useEffect } from "react";
import homeService from "../../../services/client/homeService";
import "../../../styles/client/component/DefaultComponent.css";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";

const DefaultComponent = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await homeService.getHomepage();
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
      <main>{React.cloneElement(children, { setNotificationCount })}</main>
      <FooterComponent />
    </>
  );
};

export default DefaultComponent;
