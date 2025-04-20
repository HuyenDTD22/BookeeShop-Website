import React, { useState, useContext } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ConfirmModalComponent from "../../common/ConfirmModalComponent";
import { AuthContext } from "../../../context/AuthContext";
import "../../../assets/styles/AccountTableComponent.css";

const ADMIN = process.env.REACT_APP_ADMIN;

const AccountTableComponent = ({
  accounts,
  onStatusChange,
  onDelete,
  onSelect,
  selectedAccounts,
  currentPage,
  limitItems,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDeleteModal = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (accountToDelete) {
      onDelete(accountToDelete._id);
      setShowDeleteModal(false);
      setAccountToDelete(null);
    }
  };

  const handleShowStatusModal = (id, newStatus) => {
    setStatusChange({ id, newStatus });
    setShowStatusModal(true);
  };

  const handleStatusChange = () => {
    if (statusChange) {
      setLoadingStatus(statusChange.id);
      onStatusChange(statusChange.id, statusChange.newStatus).finally(() => {
        setLoadingStatus(null);
        setShowStatusModal(false);
        setStatusChange(null);
      });
    }
  };

  const handleSelect = (id) => {
    const newSelectedAccounts = selectedAccounts.includes(id)
      ? selectedAccounts.filter((accountId) => accountId !== id)
      : [...selectedAccounts, id];
    onSelect(newSelectedAccounts);
  };

  return (
    <>
      <Table striped bordered hover className="account-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect(accounts.map((account) => account._id));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedAccounts.length === accounts.length &&
                  accounts.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Avatar</th>
            <th>Họ Tên</th>
            <th>Phân quyền</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={account._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account._id)}
                  onChange={() => handleSelect(account._id)}
                />
              </td>
              <td>{(currentPage - 1) * limitItems + index + 1}</td>
              <td>
                <img
                  src={account.avatar || "https://via.placeholder.com/50"}
                  alt={account.fullName}
                  className="account-avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              </td>
              <td>{account.fullName}</td>
              <td>{account.role?.title || "N/A"}</td>
              <td>{account.email}</td>
              <td>{account.phone}</td>
              <td>
                <Button
                  variant={account.status === "active" ? "success" : "danger"}
                  onClick={() =>
                    handleShowStatusModal(
                      account._id,
                      account.status === "active" ? "inactive" : "active"
                    )
                  }
                  disabled={
                    loadingStatus === account._id ||
                    !hasPermission("update_accounts")
                  }
                >
                  {loadingStatus === account._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : account.status === "active" ? (
                    "Hoạt động"
                  ) : (
                    "Dừng hoạt động"
                  )}
                </Button>
              </td>
              <td>{account.accountFullName || "N/A"}</td>
              <td>
                {hasPermission("read_accounts") && (
                  <Link to={`/${ADMIN}/account/detail/${account._id}`}>
                    <Button variant="info" size="sm" className="me-1">
                      <FaEye />
                    </Button>
                  </Link>
                )}
                {hasPermission("update_accounts") && (
                  <Link to={`/${ADMIN}/account/edit/${account._id}`}>
                    <Button variant="warning" size="sm" className="me-1">
                      <FaEdit />
                    </Button>
                  </Link>
                )}
                {hasPermission("delete_accounts") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(account)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal xác nhận xóa */}
      <ConfirmModalComponent
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setAccountToDelete(null);
        }}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa tài khoản "${
          accountToDelete?.title || "Không có tiêu đề"
        }" không?`}
        confirmButton={{
          label: "Xóa",
          variant: "danger",
          onClick: handleDelete,
          loading: false,
        }}
      />

      {/* Modal xác nhận thay đổi trạng thái */}
      <ConfirmModalComponent
        show={showStatusModal}
        onHide={() => {
          setShowStatusModal(false);
          setStatusChange(null);
        }}
        title="Xác nhận thay đổi trạng thái"
        body={`Bạn có chắc chắn muốn chuyển trạng thái sang "${
          statusChange?.newStatus === "active" ? "Hoạt động" : "Dừng hoạt động"
        }" cho tài khoản này không?`}
        confirmButton={{
          label: "Xác nhận",
          variant: "primary",
          onClick: handleStatusChange,
          loading: !!loadingStatus,
        }}
      />
    </>
  );
};

export default AccountTableComponent;
