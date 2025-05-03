import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryCardComponent = ({ category, link }) => {
  // Ngăn sự kiện click lan tỏa lên Link khi click vào nút "Khám phá"
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Link
      to={link || `/book/${category.slug}`}
      className="text-decoration-none"
    >
      <Card className="category-card shadow-sm border-0">
        <Card.Img
          variant="top"
          src={category.thumbnail || "https://via.placeholder.com/200"}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{category.title}</Card.Title>
          <Button
            variant="outline-primary"
            as={Link}
            to={`/book/${category.slug}`}
            onClick={handleButtonClick}
          >
            Khám phá
          </Button>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CategoryCardComponent;
