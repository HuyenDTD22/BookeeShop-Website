import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import ratingService from "../../../services/client/ratingService";

const RatingModalComponent = ({
  show,
  onHide,
  bookId,
  orderId,
  existingRating,
  onRatingSubmit,
}) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [hover, setHover] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const ratingData = { book_id: bookId, rating, order_id: orderId };
      let response;
      if (existingRating) {
        response = await ratingService.updateRating(existingRating._id, {
          rating,
        });
      } else {
        response = await ratingService.createRating(ratingData);
      }

      if (response.code === 200) {
        onRatingSubmit(response.rating);
        onHide();
      } else {
        setError(response.message || "Không thể gửi đánh giá");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {existingRating ? "Sửa đánh giá" : "Đánh giá sản phẩm"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mb-3">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onChange={() => setRating(ratingValue)}
                  style={{ display: "none" }}
                />
                <FaStar
                  className="star"
                  size={30}
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setRating(ratingValue)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              </label>
            );
          })}
        </div>
        {existingRating && (
          <Alert variant="warning" className="mb-3">
            <strong>Lưu ý:</strong> Bạn chỉ có thể sửa đánh giá trong vòng 24
            giờ
          </Alert>
        )}
        {error && <div className="text-danger text-center mb-3">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RatingModalComponent;
