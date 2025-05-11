import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import orderService from "../../../services/admin/orderService";

const OrderDetailComponent = ({ show, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail(orderId);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setOrder(null);
      }
    };

    if (show && orderId) {
      fetchOrderDetail();
    }
  }, [show, orderId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {order ? (
          <div>
            <h5>Thông tin khách hàng</h5>
            <p>
              <strong>Tên:</strong> {order.userInfo.fullName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.userInfo.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.userInfo.address}
            </p>
            <p>
              <strong>Email:</strong> {order.user_id.email}
            </p>

            <h5>Danh sách sản phẩm</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Giá</th>
                  <th>Giảm giá (%)</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.books.map((item, index) => (
                  <tr key={index}>
                    <td>{item.book_id.title}</td>
                    <td>{item.price.toLocaleString()} VNĐ</td>
                    <td>{item.discountPercentage}%</td>
                    <td>{item.quantity}</td>
                    <td>
                      {(
                        item.price *
                        item.quantity *
                        (1 - item.discountPercentage / 100)
                      ).toLocaleString()}{" "}
                      VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5>Thông tin đơn hàng</h5>
            <p>
              <strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}{" "}
              VNĐ
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailComponent;
