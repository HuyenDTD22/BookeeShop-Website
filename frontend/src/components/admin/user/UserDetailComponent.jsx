import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import userService from "../../../services/admin/userService";

const UserDetailComponent = ({ show, handleClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && userId) {
      setLoading(true);
      userService
        .getUserDetail(userId)
        .then((response) => {
          setUser(response.data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "Đã xảy ra lỗi khi lấy chi tiết khách hàng!");
        })
        .finally(() => setLoading(false));
    }
  }, [show, userId]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết khách hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Đang tải...</p>}
        {error && <p className="text-danger">{error}</p>}
        {user && (
          <div>
            <p>
              <strong>ID:</strong> {user._id}
            </p>
            <p>
              <strong>Tên:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user.phone || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.address || "N/A"}
            </p>
            <p>
              <strong>Giới tính:</strong> {user.gender || "N/A"}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getVietnameseStatus(user.status)}
            </p>
            <p>
              <strong>Ngày đăng ký:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
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

const getVietnameseStatus = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Bị khóa";
    default:
      return status;
  }
};

export default UserDetailComponent;
