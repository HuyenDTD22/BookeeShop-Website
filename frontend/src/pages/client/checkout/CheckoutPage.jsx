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
import CheckoutProductInfoComponent from "../../../components/client/checkout/CheckoutProductInfoComponent";
import CheckoutFormComponent from "../../../components/client/checkout/CheckoutFormComponent";
import "../../../styles/client/pages/CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug, quantity: initialQuantity } = location.state || {};
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(initialQuantity || 1);
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
    const fetchBookData = async () => {
      if (!slug) {
        setError("Không tìm thấy thông tin sản phẩm!");
        setLoading(false);
        return;
      }
      try {
        const bookData = await bookService.getBookDetail(slug);
        setBook(bookData.book);
      } catch (error) {
        setError(
          error.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu sách!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [slug]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error || "Không tìm thấy sản phẩm!"}</Alert>
      </Container>
    );
  }

  const subtotal = book.priceNew * quantity;
  const discount = (book.price - book.priceNew) * quantity;
  const total = subtotal;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await orderService.buyNow({
        book_id: book._id,
        quantity,
        fullName: shippingData.fullName,
        phone: shippingData.phone,
        address: shippingData.address,
        paymentMethod: paymentData.paymentMethod,
      });

      if (response.code === 200) {
        setSuccess(true);
        setTimeout(
          () => navigate(`/order/success/${response.order._id}`),
          2000
        );
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
            <h4>Thanh toán thành công!</h4>
            <p>Chuyển hướng sau 2 giây...</p>
          </Alert>
        ) : (
          <>
            {/* Phần 1: Thông tin sản phẩm và Thông tin giao hàng */}
            <Row className="mb-5">
              <Col md={6} className="mb-4 mb-md-0">
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">Thông tin sản phẩm</h4>
                    <CheckoutProductInfoComponent
                      book={book}
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">Thông tin giao hàng</h4>
                    <CheckoutFormComponent
                      onSubmit={setShippingData}
                      section="shipping"
                      data={shippingData}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Phần 2: Phương thức thanh toán và Chi tiết thanh toán */}
            <Row>
              <Col md={6} className="mb-4 mb-md-0">
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <h4 className="mb-4 text-success">
                      Phương thức thanh toán
                    </h4>
                    <CheckoutFormComponent
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
                      Hoàn tất thanh toán
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

export default CheckoutPage;
