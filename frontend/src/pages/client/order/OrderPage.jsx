import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import bookService from "../../../services/client/bookService";
import orderService from "../../../services/client/orderService";
import authService from "../../../services/client/authService";
import OrderProductInfoComponent from "../../../components/client/order/OrderProductInfoComponent";
import OrderFormComponent from "../../../components/client/order/OrderFormComponent";
import "../../../styles/client/pages/CheckoutPage.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: initialCart, slug, total: initialTotal } = location.state || {};
  const [books, setBooks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [paymentData, setPaymentData] = useState({ paymentMethod: "cod" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authStatus = await authService.checkAuth();
        if (!authStatus.isAuthenticated) {
          setError("Vui lòng đăng nhập để thanh toán.");
          setLoading(false);
          return;
        }

        let fetchedBooks = [];
        let initialQuantities = {};

        if (slug) {
          const bookData = await bookService.getBookDetail(slug);
          fetchedBooks = [bookData.book];
          initialQuantities[bookData.book._id] = 1;
        } else if (initialCart && initialCart.length > 0) {
          if (initialCart.every((item) => item.bookInfo)) {
            fetchedBooks = initialCart.map((item) => item.bookInfo);
            initialCart.forEach((item) => {
              initialQuantities[item.book_id] = item.quantity || 1;
            });
          } else {
            setError("Dữ liệu giỏ hàng không chứa thông tin chi tiết sách!");
            setLoading(false);
            return;
          }
        } else {
          setError("Không tìm thấy thông tin sản phẩm!");
          setLoading(false);
          return;
        }

        const userData = await authService.getUserInfo();
        setShippingData({
          fullName: userData.info.fullName || "",
          phone: userData.info.phone || "",
          address: userData.info.address || "",
        });

        setBooks(fetchedBooks);
        setQuantities(initialQuantities);
      } catch (error) {
        setError(
          error.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialCart, slug]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || books.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error || "Không tìm thấy sản phẩm!"}</Alert>
      </Container>
    );
  }

  const subtotal = books.reduce(
    (sum, book) => sum + book.price * (quantities[book._id] || 1),
    0
  );
  const discount = books.reduce(
    (sum, book) =>
      sum + (book.price - book.priceNew) * (quantities[book._id] || 1),
    0
  );

  const total = books.reduce(
    (sum, book) => sum + book.priceNew * (quantities[book._id] || 1),
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const authStatus = await authService.checkAuth();
      if (!authStatus.isAuthenticated) {
        setError("Vui lòng đăng nhập để thanh toán.");
        setLoading(false);
        return;
      }

      const orderItems = books.map((book) => ({
        book_id: book._id,
        quantity: quantities[book._id] || 1,
      }));

      const response = await orderService.buyNow({
        items: orderItems,
        fullName: shippingData.fullName,
        phone: shippingData.phone,
        address: shippingData.address,
        paymentMethod: paymentData.paymentMethod,
      });

      if (response.code === 200) {
        setSuccess(true);
        setTimeout(() => navigate(`/user`), 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi thanh toán!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="checkout-page my-5">
      <Card.Body>
        <h2 className="text-center mb-5 text-primary fw-bold">
          Thanh Toán Đơn Hàng
        </h2>
        {success ? (
          <Alert variant="success" className="text-center py-4">
            <h4>Đặt hàng thành công!</h4>
            <p>Chuyển hướng sau 2 giây...</p>
          </Alert>
        ) : (
          <>
            <Row className="mb-5">
              <Col md={6} className="mb-4 mb-md-0">
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">Thông tin sản phẩm</h4>
                    {books.map((book, index) => (
                      <div key={book._id}>
                        <OrderProductInfoComponent
                          book={book}
                          quantity={quantities[book._id] || 1}
                          setQuantity={(newQty) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [book._id]: newQty,
                            }))
                          }
                        />
                        {index < books.length - 1 && (
                          <hr
                            className="my-3"
                            style={{ borderTop: "1px solid #dee2e6" }}
                          />
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">Thông tin giao hàng</h4>
                    <OrderFormComponent
                      onSubmit={setShippingData}
                      section="shipping"
                      data={shippingData}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-4 mb-md-0">
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">
                      Phương thức thanh toán
                    </h4>
                    <OrderFormComponent
                      onSubmit={setPaymentData}
                      section="payment"
                      data={paymentData}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">Chi tiết thanh toán</h4>
                    <div className="mb-3">
                      <span className="text-muted">Tổng tiền hàng:</span>
                      <span className="float-end fw-bold">
                        {subtotal.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-muted">Giảm giá:</span>
                      <span className="float-end fw-bold">
                        {discount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="mb-3">
                      <span className="text-muted">Phí vận chuyển:</span>
                      <span className="float-end fw-bold">0 VNĐ</span>
                    </div>
                    <hr className="my-2" />
                    <div className="mb-4">
                      <strong>Tổng thanh toán:</strong>
                      <strong className="float-end text-danger">
                        {total.toLocaleString("vi-VN")} VNĐ
                      </strong>
                    </div>
                    <Button
                      variant="primary"
                      className="w-100 py-2 rounded-3"
                      onClick={handleCheckout}
                    >
                      Đặt hàng
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </>
        )}
      </Card.Body>
    </Container>
  );
};

export default OrderPage;
