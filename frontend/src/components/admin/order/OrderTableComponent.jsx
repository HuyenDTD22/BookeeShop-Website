import React, { useState, useContext } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import OrderDetailComponent from "./OrderDetailComponent";
import { AuthContext } from "../../../context/AuthContext";
import "../../../styles/admin/component/OrderTableComponent.css";

const ADMIN = process.env.REACT_APP_ADMIN;

const OrderTableComponent = ({
  orders,
  onUpdateStatus,
  onDelete,
  onSelect,
  selectedOrders = [],
  currentPage = 1,
  limitItems = 10,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateStatus(orderId, newStatus);
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      onDelete(orderId);
    }
  };

  const handleSelect = (orderId) => {
    const newSelectedOrders = selectedOrders.includes(orderId)
      ? selectedOrders.filter((id) => id !== orderId)
      : [...selectedOrders, orderId];
    onSelect(newSelectedOrders);
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect(orders.map((order) => order._id));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedOrders.length === orders.length && orders.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th className="text-center align-middle">Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => handleSelect(order._id)}
                />
              </td>
              <td>{(currentPage - 1) * limitItems + index + 1}</td>
              <td>{order._id}</td>
              <td>{order.userInfo.fullName}</td>
              <td>{order.totalPrice.toLocaleString()} VNĐ</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td className="text-center align-middle">
                <Dropdown
                  onSelect={(newStatus) =>
                    handleStatusChange(order._id, newStatus)
                  }
                >
                  <Dropdown.Toggle
                    variant={getStatusVariant(order.status)}
                    size="sm"
                    className="d-inline-block text-center w-75"
                  >
                    {getVietnameseStatus(order.status)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="pending">
                      Chờ xác nhận
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="delivered">
                      Đang giao hàng
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="completed">
                      Đã Hoàn thành
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="cancelled">Đã hủy</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                {hasPermission("read_orders") && (
                  <Button
                    variant="info"
                    size="sm"
                    className="me-1"
                    onClick={() => handleShowDetail(order)}
                  >
                    <FaEye />
                  </Button>
                )}
                {hasPermission("delete_orders") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(order._id)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <OrderDetailComponent
          show={showDetailModal}
          handleClose={handleCloseDetail}
          orderId={selectedOrder._id}
        />
      )}
    </>
  );
};

// Helper để chọn màu sắc cho trạng thái
const getStatusVariant = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "delivered":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

// Helper để chuyển trạng thái sang tiếng Việt
const getVietnameseStatus = (status) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "delivered":
      return "Đang giao hàng";
    case "completed":
      return "Đã Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

export default OrderTableComponent;
