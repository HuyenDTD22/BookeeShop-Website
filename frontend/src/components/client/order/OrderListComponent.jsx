import React, { useState, useEffect } from "react";
import {
  ListGroup,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import orderService from "../../../services/client/orderService";
import ratingService from "../../../services/client/ratingService";
import RatingModalComponent from "../rating/RatingModalComponent";

const OrderListComponent = ({ orders, title }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  // Hàm chuyển trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "delivered":
        return "Đang giao hàng";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Hàm tính priceNew
  const calculatePriceNew = (price, discountPercentage) => {
    const basePrice = price || 0;
    const discount = discountPercentage || 0;
    return Math.round((basePrice * (100 - discount)) / 100);
  };

  // Lấy danh sách đánh giá cho từng sách
  const fetchRatings = async (bookId) => {
    try {
      const response = await ratingService.getRatings(bookId);
      if (response.code === 200) {
        setRatings((prev) => ({
          ...prev,
          [bookId]: response.ratings,
        }));
      }
    } catch (error) {
      console.error(`Error fetching ratings for book ${bookId}:`, error);
    }
  };

  // Kiểm tra đánh giá và thời gian 24 giờ
  const canShowReviewButton = (bookId, order) => {
    if (order.status !== "completed") return false;

    const bookRatings = ratings[bookId] || [];
    const userRating = bookRatings.find(
      (rating) => rating.order_id.toString() === order._id.toString()
    );

    if (!userRating) return true; // Chưa đánh giá, hiển thị nút

    // Kiểm tra thời gian 24 giờ
    const ratingTime = new Date(userRating.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - ratingTime) / (1000 * 60 * 60);
    return diffHours <= 24; // Hiển thị nút nếu chưa quá 24 giờ
  };

  // Lấy danh sách đánh giá khi component mount
  useEffect(() => {
    orders.forEach((order) => {
      if (order.status === "completed" && order.books) {
        order.books.forEach((item) => {
          const bookId = item.book_id?._id;
          if (bookId) {
            fetchRatings(bookId);
          }
        });
      }
    });
  }, [orders]);

  const handleViewDetail = async (orderId) => {
    setLoadingDetail(true);
    setErrorDetail("");
    try {
      const response = await orderService.getOrderDetail(orderId);
      if (response.code === 200) {
        setSelectedOrder(response.order);
        setShowModal(true);
      } else {
        setErrorDetail(response.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (error) {
      setErrorDetail(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải chi tiết đơn hàng!"
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    try {
      const response = await orderService.cancelOrder(orderToCancel);
      if (response.code === 200) {
        alert("Hủy đơn hàng thành công!");
        window.location.reload();
      } else {
        alert(response.message || "Không thể hủy đơn hàng!");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi hủy đơn hàng!");
    } finally {
      setShowConfirmModal(false);
      setOrderToCancel(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setErrorDetail("");
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setOrderToCancel(null);
  };

  const handleBuyAgain = (order) => {
    const cart = order.books.map((item) => {
      const price = item.price || item.book_id.price || 0;
      const discountPercentage = item.discountPercentage || 0;
      const priceNew = calculatePriceNew(price, discountPercentage);
      return {
        book_id: item.book_id._id,
        bookInfo: {
          ...item.book_id,
          price: price,
          priceNew: priceNew,
        },
        quantity: item.quantity,
      };
    });
    navigate("/order", { state: { cart } });
  };

  const handleShowRatingModal = (bookId, orderId) => {
    setSelectedBookId(bookId);
    setSelectedOrderId(orderId);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (newRating) => {
    setRatings((prev) => ({
      ...prev,
      [newRating.book_id]: [...(prev[newRating.book_id] || []), newRating],
    }));
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item
              key={order._id}
              className="mb-3 border rounded shadow-sm hover-shadow"
              style={{ transition: "transform 0.2s", padding: "15px" }}
            >
              {/* Mã đơn hàng */}
              <p className="mb-1">
                <strong>Mã đơn hàng:</strong> {order._id}
              </p>

              {/* Hiển thị tất cả sản phẩm */}
              {order.books && order.books.length > 0 ? (
                order.books.map((item, index) => (
                  <Row key={index} className="align-items-center mb-2 no-gap">
                    <Col xs={1}>
                      <Image
                        src={
                          item.book_id?.thumbnail ||
                          "https://via.placeholder.com/50x75"
                        }
                        alt={item.book_id?.title || "Hình ảnh sản phẩm"}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </Col>
                    <Col xs={8}>
                      <p className="align-items-center mb-2 no-gap">
                        <strong>
                          {item.book_id?.title || "Không có thông tin"}
                        </strong>
                        <span className="text-danger ms-2">
                          {calculatePriceNew(
                            item.price,
                            item.discountPercentage
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </span>
                        <span
                          className="text-muted ms-2"
                          style={{ textDecoration: "line-through" }}
                        >
                          {(item.price || 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                        <span className="ms-2 text-muted">
                          x{item.quantity || 0}
                        </span>
                      </p>
                    </Col>
                    <Col xs={3} className="text-end">
                      {/* Bỏ nút Đánh giá khỏi đây */}
                    </Col>
                  </Row>
                ))
              ) : (
                <p className="text-muted mb-1">Không có thông tin sản phẩm</p>
              )}

              {/* Trạng thái */}
              <p className="mb-1">
                <strong>Trạng thái:</strong>{" "}
                <strong>
                  <span
                    className={
                      order.status === "cancelled"
                        ? "text-danger"
                        : order.status === "completed"
                        ? "text-success"
                        : "text-primary"
                    }
                  >
                    {translateStatus(order.status)}
                  </span>
                </strong>
              </p>

              {/* Ngày đặt */}
              <p className="mb-1">
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>

              {/* Nút hành động */}
              <div className="mt-2">
                <Button
                  variant="primary"
                  onClick={() => handleViewDetail(order._id)}
                  className="me-2"
                >
                  Xem chi tiết
                </Button>
                {order.status === "pending" && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancelOrder(order._id)}
                    className="me-2"
                  >
                    Hủy đơn
                  </Button>
                )}
                {(order.status === "completed" ||
                  order.status === "cancelled") && (
                  <Button
                    variant="success"
                    onClick={() => handleBuyAgain(order)}
                    className="me-2"
                  >
                    Mua lại
                  </Button>
                )}
                {order.books.some((item) =>
                  canShowReviewButton(item.book_id?._id, order)
                ) && (
                  <Button
                    variant="warning"
                    onClick={() =>
                      handleShowRatingModal(
                        order.books.find((item) =>
                          canShowReviewButton(item.book_id?._id, order)
                        ).book_id?._id,
                        order._id
                      )
                    }
                    className="me-2"
                  >
                    Đánh giá
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Header className="bg-primary">
          <Modal.Title className="text-white">Chi tiết đơn hàng</Modal.Title>
          <Button
            variant="danger"
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              border: "none",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loadingDetail ? (
            <div className="text-center">
              <span>Đang tải...</span>
            </div>
          ) : errorDetail ? (
            <div className="text-danger">{errorDetail}</div>
          ) : selectedOrder ? (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="text-success">Thông tin đơn hàng</h5>
                  <p>
                    <strong>Mã đơn hàng:</strong> {selectedOrder._id}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Ngày đặt:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {selectedOrder.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : selectedOrder.paymentMethod}
                  </p>
                </Col>
                <Col md={1} className="d-flex justify-content-center">
                  <div
                    style={{
                      width: "2px",
                      backgroundColor: "#dee2e6",
                      height: "100%",
                    }}
                  ></div>
                </Col>
                <Col md={5}>
                  <h5 className="text-success">Thông tin giao hàng</h5>
                  <p>
                    <strong>Họ tên:</strong>{" "}
                    {selectedOrder.userInfo?.fullName || "Không có thông tin"}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {selectedOrder.userInfo?.phone || "Không có thông tin"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedOrder.userInfo?.address || "Không có thông tin"}
                  </p>
                </Col>
              </Row>
              <hr />
              <h5 className="text-success mb-3">Danh sách sản phẩm</h5>
              {selectedOrder.books.map((item, index) => {
                const priceNew = calculatePriceNew(
                  item.price,
                  item.discountPercentage
                );
                return (
                  <Link
                    to={`/book/detail/${item.book_id?.slug || ""}`}
                    key={index}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      className="mb-3 shadow-sm border-0 hover-shadow"
                      style={{ transition: "transform 0.2s" }}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col xs={2}>
                            <Image
                              src={
                                item.book_id?.thumbnail ||
                                "https://via.placeholder.com/80x120"
                              }
                              alt={item.book_id?.title || "Sách không có ảnh"}
                              style={{
                                width: "80px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          </Col>
                          <Col xs={4}>
                            <h6 className="mb-2" style={{ color: "#000" }}>
                              {item.book_id?.title || "Không có thông tin"}
                            </h6>
                          </Col>
                          <Col xs={4}>
                            <p className="mb-1">
                              <span className="text-danger me-2">
                                {priceNew.toLocaleString("vi-VN")} VNĐ
                              </span>
                              <span
                                className="text-muted ms-1"
                                style={{ textDecoration: "line-through" }}
                              >
                                {(item.book_id?.price || 0).toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                VNĐ
                              </span>
                            </p>
                          </Col>
                          <Col xs={2}>
                            <p className="mb-1">
                              <strong>Số lượng:</strong> {item.quantity || 0}
                            </p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                );
              })}
              <hr />
              <h5 className="text-end text-danger">
                Tổng tiền:{" "}
                {(selectedOrder.totalPrice || 0).toLocaleString("vi-VN")} VNĐ
              </h5>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>

      {/* Modal xác nhận hủy đơn hàng */}
      <Modal
        show={showConfirmModal}
        onHide={handleCloseConfirmModal}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header className="bg-danger text-white">
          <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal đánh giá */}
      {selectedBookId && selectedOrderId && (
        <RatingModalComponent
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          bookId={selectedBookId}
          orderId={selectedOrderId}
          existingRating={ratings[selectedBookId]?.find(
            (r) => r.order_id.toString() === selectedOrderId.toString()
          )}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default OrderListComponent;
