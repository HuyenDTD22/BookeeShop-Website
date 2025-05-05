import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cartService from "../../../services/client/cartService";
import CartItemComponent from "../../../components/client/cart/CartItemComponent";
import "../../../styles/client/pages/CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState({ books: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        if (response.code === 200) {
          console.log(response.cartDetail);
          setCart(response.cartDetail);
        } else {
          setError("Không thể tải giỏ hàng.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (bookId, quantity) => {
    try {
      await cartService.updateQuantity(bookId, quantity);
      const updatedCart = await cartService.getCart();
      if (updatedCart.code === 200) {
        setCart(updatedCart.cartDetail);
      }
    } catch (err) {
      setError("Cập nhật số lượng thất bại.");
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await cartService.deleteFromCart(bookId);
      const updatedCart = await cartService.getCart();
      if (updatedCart.code === 200) {
        setCart(updatedCart.cartDetail);
        setSelectedItems((prev) => prev.filter((id) => id !== bookId));
      }
    } catch (err) {
      setError("Xóa sản phẩm thất bại.");
    }
  };

  const handleSelectItem = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cart.books.map((item) => item.book_id));
    } else {
      setSelectedItems([]);
    }
  };

  const calculateSelectedTotal = () => {
    if (selectedItems.length === 0) {
      return cart.totalPrice;
    }
    return cart.books
      .filter((item) => selectedItems.includes(item.book_id))
      .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const handleCheckout = () => {
    const selectedBooks = cart.books.filter((item) =>
      selectedItems.includes(item.book_id)
    );
    navigate("/order", {
      state: { cart: selectedBooks, total: calculateSelectedTotal() },
    });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div>Đang tải giỏ hàng...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <div className="text-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Giỏ hàng của bạn</h2>
      {cart.books.length === 0 ? (
        <div>Giỏ hàng của bạn trống.</div>
      ) : (
        <>
          <Table responsive striped bordered hover className="cart-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedItems.length === cart.books.length &&
                      cart.books.length > 0
                    }
                  />
                </th>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.books.map((item, index) => (
                <CartItemComponent
                  key={item.book_id}
                  item={item}
                  index={index + 1}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onSelect={handleSelectItem}
                  isSelected={selectedItems.includes(item.book_id)}
                />
              ))}
            </tbody>
          </Table>
          <Card className="mt-4 p-3 total-card">
            <Row>
              <Col md={6}>
                <h4>Tổng cộng</h4>
                <p>
                  Tổng tiền: {calculateSelectedTotal().toLocaleString("vi-VN")}{" "}
                  VNĐ
                </p>
              </Col>
              <Col md={6} className="text-end">
                <Button variant="primary" size="lg" onClick={handleCheckout}>
                  Thanh toán
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </Container>
  );
};

export default CartPage;
