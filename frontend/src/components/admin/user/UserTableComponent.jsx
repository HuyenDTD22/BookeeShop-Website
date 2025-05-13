import React, { useState, useContext } from "react";
import { Table, Button, Image } from "react-bootstrap";
import { FaEye, FaTrash, FaLock } from "react-icons/fa";
import UserDetailComponent from "./UserDetailComponent";
import ConfirmModalComponent from "../../common/ConfirmModalComponent";
import { AuthContext } from "../../../context/AuthContext";
import "../../../styles/admin/component/UserTableComponent.css";

const UserTableComponent = ({
  users,
  onUpdateStatus,
  onDelete,
  onSelect,
  selectedUsers = [],
  currentPage = 1,
  limitItems = 10,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToChange, setUserToChange] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  const handleShowConfirmModal = (user) => {
    setUserToChange(user);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setUserToChange(null);
  };

  const handleStatusChange = async () => {
    if (!userToChange) return;

    const newStatus = userToChange.status === "active" ? "inactive" : "active";
    setIsUpdating(true);

    try {
      await onUpdateStatus(userToChange._id, newStatus);
      handleCloseConfirmModal();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      onDelete(userId);
    }
  };

  const handleSelect = (userId) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    onSelect(newSelectedUsers);
  };

  return (
    <>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect(users.map((user) => user._id));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedUsers.length === users.length && users.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Ngày đăng ký</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleSelect(user._id)}
                />
              </td>
              <td>{(currentPage - 1) * limitItems + index + 1}</td>
              <td>
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullName}
                  roundedCircle
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone || "N/A"}</td>
              <td className="text-center align-middle">
                <Button
                  variant={getStatusVariant(user.status)}
                  size="sm"
                  className="d-inline-block text-center w-100"
                  onClick={() => handleShowConfirmModal(user)}
                >
                  {getVietnameseStatus(user.status)}
                </Button>
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                {hasPermission("read_users") && (
                  <Button
                    variant="info"
                    size="sm"
                    className="me-1"
                    onClick={() => handleShowDetail(user)}
                  >
                    <FaEye />
                  </Button>
                )}
                {hasPermission("delete_users") && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-1"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedUser && (
        <UserDetailComponent
          show={showDetailModal}
          handleClose={handleCloseDetail}
          userId={selectedUser._id}
        />
      )}

      {showConfirmModal && userToChange && (
        <ConfirmModalComponent
          show={showConfirmModal}
          onHide={handleCloseConfirmModal}
          title="Xác nhận thay đổi trạng thái"
          body={`Bạn có chắc chắn muốn thay đổi trạng thái của khách hàng ${
            userToChange.fullName
          } từ "${getVietnameseStatus(userToChange.status)}" sang "${
            userToChange.status === "active" ? "Không hoạt động" : "Hoạt động"
          }"?`}
          confirmButton={{
            label: "OK",
            variant: "primary",
            onClick: handleStatusChange,
            loading: isUpdating,
          }}
          cancelButton={{ label: "Hủy", variant: "secondary" }}
        />
      )}
    </>
  );
};

const getStatusVariant = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "danger";
    default:
      return "secondary";
  }
};

const getVietnameseStatus = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return status;
  }
};

export default UserTableComponent;
