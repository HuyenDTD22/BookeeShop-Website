import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryCardComponent = ({ category, link }) => {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Link
      to={link || `/book/${category.slug}`}
      className="text-decoration-none"
    >
      <Card
        className="category-card shadow-sm"
        style={{ border: "1px solid #ccc" }}
      >
        <Card.Img
          variant="top"
          src={category.thumbnail || "https://via.placeholder.com/200"}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title style={{ fontSize: "1rem" }}>{category.title}</Card.Title>
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
