import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Alert, Spinner, Button } from "react-bootstrap";

const VnpayResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";
  const isFailed = status === "failed";

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/user"), 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <Container className="my-5 text-center">
      {!status && <Spinner animation="border" variant="primary" />}

      {isSuccess && (
        <Alert variant="success">
          <h4>🎉 Thanh toán VNPay thành công!</h4>
          <p>
            Mã đơn hàng: <strong>{orderId}</strong>
          </p>
          <p>Tự động chuyển về trang tài khoản sau 4 giây...</p>
          <Button variant="success" onClick={() => navigate("/user")}>
            Về trang của tôi
          </Button>
        </Alert>
      )}

      {isFailed && (
        <Alert variant="danger">
          <h4>❌ Thanh toán thất bại</h4>
          <p>Đơn hàng đã bị huỷ. Vui lòng thử lại.</p>
          <Button variant="primary" onClick={() => navigate("/order")}>
            Thử lại
          </Button>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="warning">
          <h4>⚠️ Có lỗi xảy ra</h4>
          <p>{searchParams.get("message")}</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default VnpayResultPage;
