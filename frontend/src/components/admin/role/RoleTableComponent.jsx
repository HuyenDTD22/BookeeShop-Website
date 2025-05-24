import React, { useState, useContext } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ConfirmModalComponent from "../../common/ConfirmModalComponent";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const RoleTableComponent = ({
  roles,
  onStatusChange,
  onDelete,
  onSelect,
  selectedRoles,
  currentPage,
  limitItems,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDeleteModal = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (roleToDelete) {
      onDelete(roleToDelete._id);
      setShowDeleteModal(false);
      setRoleToDelete(null);
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
    const newSelectedRoles = selectedRoles.includes(id)
      ? selectedRoles.filter((roleId) => roleId !== id)
      : [...selectedRoles, id];
    onSelect(newSelectedRoles);
  };

  return (
    <>
      <Table bordered hover className="role-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect(roles.map((role) => role._id));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedRoles.length === roles.length && roles.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Nhóm quyền</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role._id)}
                  onChange={() => handleSelect(role._id)}
                />
              </td>
              <td>{(currentPage - 1) * limitItems + index + 1}</td>
              <td>{role.title}</td>
              <td>{role.description || "N/A"}</td>
              <td>
                <Button
                  variant={role.status === "active" ? "success" : "danger"}
                  onClick={() =>
                    handleShowStatusModal(
                      role._id,
                      role.status === "active" ? "inactive" : "active"
                    )
                  }
                  disabled={
                    loadingStatus === role._id || !hasPermission("update_roles")
                  }
                >
                  {loadingStatus === role._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : role.status === "active" ? (
                    "Hoạt động"
                  ) : (
                    "Dừng hoạt động"
                  )}
                </Button>
              </td>
              <td>
                {hasPermission("update_roles") && (
                  <Link to={`/${ADMIN}/role/edit/${role._id}`}>
                    <Button variant="warning" size="sm" className="me-1">
                      <FaEdit />
                    </Button>
                  </Link>
                )}
                {hasPermission("delete_roles") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(role)}
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
          setRoleToDelete(null);
        }}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa nhóm quyền "${
          roleToDelete?.title || "Không có tiêu đề"
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
        }" cho nhóm quyền này không?`}
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

export default RoleTableComponent;
