import React, { useState, useEffect } from "react";
import cartService from "../../../services/client/cartService";

const CartItemCountComponent = ({ setCartItemCount }) => {
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        if (response.code === 200 && response.cartDetail.books) {
          const totalItems = response.cartDetail.books.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          setCartItemCount(totalItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
    const interval = setInterval(fetchCart, 5000); // Cập nhật mỗi 5 giây
    return () => clearInterval(interval); // Cleanup
  }, [setCartItemCount]);

  return null; // Không render nội dung, chỉ quản lý state
};

export default CartItemCountComponent;
