import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const OrderFormComponent = ({ onSubmit, section = "shipping", data }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    if (onSubmit) onSubmit(newData);
  };

  return (
    <Form>
      {section === "shipping" ? (
        <>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={data.fullName || ""}
                  onChange={handleChange}
                  required
                  className="rounded-3"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={data.phone || ""}
                  onChange={handleChange}
                  required
                  className="rounded-3"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Địa chỉ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={data.address || ""}
              onChange={handleChange}
              required
              className="rounded-3"
            />
          </Form.Group>
        </>
      ) : (
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-muted">Chọn phương thức</Form.Label>
              <Form.Check
                type="radio"
                label="Thanh toán khi nhận hàng (COD)"
                name="paymentMethod"
                value="cod"
                checked={data.paymentMethod === "cod"}
                onChange={handleChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Chuyển khoản ngân hàng"
                name="paymentMethod"
                value="bank_transfer"
                checked={data.paymentMethod === "bank_transfer"}
                onChange={handleChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Thanh toán qua ví Momo"
                name="paymentMethod"
                value="momo"
                checked={data.paymentMethod === "momo"}
                onChange={handleChange}
                className="mb-2"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            {data.paymentMethod === "bank_transfer" && (
              <img
                src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1747149931/MB-0358913980-compact_hkxhlg.png"
                alt="Bank Transfer QR"
                style={{ width: "200px", height: "200px" }}
              />
            )}
            {data.paymentMethod === "momo" && (
              <img
                src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1747149918/momo-upload-api-191220155242-637124539621172097-300x300_khc5gc.png"
                alt="Momo QR"
                style={{ width: "200px", height: "200px" }}
              />
            )}
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default OrderFormComponent;
