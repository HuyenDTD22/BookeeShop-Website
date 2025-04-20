import React, { useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { updatePermissions } from "../../../services/admin/roleService";

const PermissionsTableComponent = ({ roles }) => {
  // Danh sách tính năng và quyền
  const features = [
    {
      name: "Danh mục",
      permissions: [
        { key: "read_categories", label: "Xem" },
        { key: "create_categories", label: "Thêm mới" },
        { key: "update_categories", label: "Chỉnh sửa" },
        { key: "delete_categories", label: "Xóa" },
      ],
    },
    {
      name: "Sản phẩm",
      permissions: [
        { key: "read_books", label: "Xem" },
        { key: "create_books", label: "Thêm mới" },
        { key: "update_books", label: "Chỉnh sửa" },
        { key: "delete_books", label: "Xóa" },
      ],
    },
    {
      name: "Nhóm quyền",
      permissions: [
        { key: "read_roles", label: "Xem" },
        { key: "create_roles", label: "Thêm mới" },
        { key: "update_roles", label: "Chỉnh sửa" },
        { key: "delete_roles", label: "Xóa" },
      ],
    },
    {
      name: "Tài khoản",
      permissions: [
        { key: "read_accounts", label: "Xem" },
        { key: "create_accounts", label: "Thêm mới" },
        { key: "update_accounts", label: "Chỉnh sửa" },
        { key: "delete_accounts", label: "Xóa" },
      ],
    },
  ];

  // State để lưu trạng thái quyền
  const [permissionsState, setPermissionsState] = useState(
    roles.map((role) => ({
      id: role._id,
      permissions: [...role.permissions],
    }))
  );

  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi checkbox
  const handlePermissionChange = (roleId, permissionKey) => {
    setPermissionsState((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          const newPermissions = role.permissions.includes(permissionKey)
            ? role.permissions.filter((perm) => perm !== permissionKey)
            : [...role.permissions, permissionKey];
          return { ...role, permissions: newPermissions };
        }
        return role;
      })
    );
  };

  // Xử lý cập nhật quyền
  const handleUpdatePermissions = async () => {
    setLoading(true);
    try {
      await updatePermissions(permissionsState);
      alert("Cập nhật phân quyền thành công!");
    } catch (error) {
      alert("Cập nhật phân quyền thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-3">Phân quyền</h1>
        <Button
          variant="primary"
          onClick={handleUpdatePermissions}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Cập nhật"}
        </Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Tính năng</th>
            {roles.map((role) => (
              <th key={role._id}>{role.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, featureIndex) => (
            <React.Fragment key={featureIndex}>
              <tr className="feature-header">
                <td colSpan={roles.length + 1} className="fw-bold">
                  {feature.name}
                </td>
              </tr>
              {feature.permissions.map((perm, permIndex) => (
                <tr key={`${featureIndex}-${permIndex}`}>
                  <td>{perm.label}</td>
                  {roles.map((role) => {
                    const rolePerms =
                      permissionsState.find((r) => r.id === role._id)
                        ?.permissions || [];
                    return (
                      <td key={role._id}>
                        <input
                          type="checkbox"
                          checked={rolePerms.includes(perm.key)}
                          onChange={() =>
                            handlePermissionChange(role._id, perm.key)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default PermissionsTableComponent;
