import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const ADMIN = process.env.REACT_APP_ADMIN;

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.includes(`${ADMIN}`);

  const homePath = isAdmin ? `/${ADMIN}/` : "/";

  const handleGoHome = () => {
    navigate(homePath);
  };

  return (
    <Container className="not-found-container" style={{ minHeight: "100vh" }}>
      <Row
        className="align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <Col md={6} className="text-center">
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <h2 className="mb-4">Oops! Trang không được tìm thấy</h2>
          <p className="lead mb-4">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Đừng lo, chúng tôi sẽ giúp bạn quay lại!
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="me-3"
          >
            Về trang chủ
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            href="mailto:support@example.com"
          >
            Liên hệ hỗ trợ
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
