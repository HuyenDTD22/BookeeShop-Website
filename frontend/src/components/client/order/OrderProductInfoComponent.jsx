import React from "react";
import { Row, Col, Form } from "react-bootstrap";

const OrderProductInfoComponent = ({ book, quantity, setQuantity }) => {
  return (
    <Row className="align-items-center">
      <Col md={3}>
        <img
          src={book.thumbnail}
          alt={book.title}
          style={{
            width: "120px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      </Col>
      <Col md={4}>
        <h5 className="mb-0">{book.title}</h5>
      </Col>
      <Col md={3}>
        <p className="mb-0 text-danger fw-bold">
          {(book.priceNew || 0).toLocaleString("vi-VN")} VNĐ
        </p>
        <small className="text-muted text-decoration-line-through">
          {(book.price || 0).toLocaleString("vi-VN")} VNĐ
        </small>
      </Col>
      <Col md={2}>
        <Form.Group controlId="quantity">
          <Form.Control
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            className="w-100"
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default OrderProductInfoComponent;
