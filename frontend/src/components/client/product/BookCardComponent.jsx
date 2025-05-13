import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookCardComponent = ({ book, link }) => {
  const renderStars = (rating) => {
    const maxStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning me-1" />);
    }

    if (hasHalfStar && stars.length < maxStars) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning me-1" />);
    }

    while (stars.length < maxStars) {
      stars.push(<FaStar key={stars.length + 1} className="text-muted me-1" />);
    }

    return stars;
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Link
      to={link || `/book/detail/${book.slug}`}
      className="text-decoration-none"
    >
      <Card className="book-card shadow-sm border-0 h-100">
        <Card.Img
          variant="top"
          src={book.thumbnail || "https://via.placeholder.com/200"}
          alt={book.title}
          className="book-card-img"
        />
        <Card.Body className="book-card-body">
          <Card.Title className="text-primary book-card-title">
            <Link
              to={`/book/detail/${book.slug}`}
              className="text-decoration-none"
              onClick={handleButtonClick}
            >
              {book.title}
            </Link>
          </Card.Title>
          <div className="mb-2 book-card-price">
            {book.discountPercentage > 0 ? (
              <>
                <span className="text-danger fw-bold me-2">
                  {book.priceNew?.toLocaleString()}đ
                </span>
                <span className="text-muted text-decoration-line-through me-2">
                  {book.price?.toLocaleString()}đ
                </span>
                <Badge bg="danger">-{book.discountPercentage}%</Badge>
              </>
            ) : (
              <span className="text-danger fw-bold">
                {book.price?.toLocaleString()}đ
              </span>
            )}
          </div>
          <div className="mb-2 book-card-sold">
            Đã bán: {book.soldCount || 0}
          </div>
          <div className="mb-2 book-card-rating">
            {renderStars(book.rating_mean || 5)}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default BookCardComponent;
