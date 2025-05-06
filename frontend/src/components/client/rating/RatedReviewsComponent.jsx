import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate
import { Card, ListGroup, Spinner, Image } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import ratingService from "../../../services/client/ratingService";

const RatedReviewsComponent = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const response = await ratingService.getUserRatings();
        console.log("API Response:", response);
        setRatings(response.ratings || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Đã xảy ra lỗi khi tải đánh giá"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserRatings();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center my-3">{error}</div>;
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center my-3">Bạn chưa đánh giá sản phẩm nào.</div>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <FaStar className="me-2" size={24} />
          <h2 className="m-0 fs-4">Đã đánh giá</h2>
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        {ratings.map((rating) => (
          <ListGroup.Item
            key={rating._id}
            className="d-flex align-items-center justify-content-between"
            onClick={() => navigate(`/book/detail/${rating.book_id?.slug}`)} // Chuyển hướng khi nhấn
            style={{ cursor: "pointer" }} // Thêm con trỏ để biểu thị có thể nhấn
          >
            <div className="d-flex align-items-center">
              <Image
                src={
                  rating.book_id?.thumbnail ||
                  "https://via.placeholder.com/50x75"
                }
                alt={rating.book_id?.title || "Hình ảnh sách"}
                style={{
                  width: "60px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginRight: "15px",
                }}
              />
              <div>
                <strong>
                  {rating.book_id?.title || "Sách không xác định"}
                </strong>
                <br />
                <small>
                  Đánh giá vào:{" "}
                  {new Date(rating.createdAt).toLocaleString("vi-VN")}
                </small>
              </div>
            </div>
            <div className="text-warning">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={16}
                  color={index < rating.rating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default RatedReviewsComponent;
