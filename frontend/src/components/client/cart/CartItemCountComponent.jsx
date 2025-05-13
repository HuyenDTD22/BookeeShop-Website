import React, { useEffect } from "react";
import cartService from "../../../services/client/cartService";
import authService from "../../../services/client/authService";

const CartItemCountComponent = ({ setCartItemCount }) => {
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const authStatus = await authService.checkAuth();
        if (authStatus.isAuthenticated) {
          const response = await cartService.getCart();
          if (response.code === 200 && response.cartDetail.books) {
            const totalItems = response.cartDetail.books.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            );
            setCartItemCount(totalItems);
          }
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItemCount(0);
      }
    };
    fetchCart();
    const interval = setInterval(fetchCart, 5000);
    return () => clearInterval(interval);
  }, [setCartItemCount]);

  return null;
};

export default CartItemCountComponent;
