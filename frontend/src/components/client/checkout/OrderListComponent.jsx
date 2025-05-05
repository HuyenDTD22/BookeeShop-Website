import React from "react";
import { ListGroup, Button, Card } from "react-bootstrap";
import orderService from "../../../services/client/orderService";
import { useNavigate } from "react-router-dom";

const OrderListComponent = ({ orders, title }) => {
  const navigate = useNavigate();

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi hủy đơn hàng!");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order._id}>
              <p>
                <strong>Mã đơn hàng:</strong> {order._id}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {order.totalPrice.toLocaleString("vi-VN")} VNĐ
              </p>
              <p>
                <strong>Trạng thái:</strong> {order.status}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(`/order/detail/${order._id}`)}
                className="me-2"
              >
                Xem chi tiết
              </Button>
              {order.status === "pending" && (
                <Button
                  variant="danger"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Hủy đơn
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default OrderListComponent;
