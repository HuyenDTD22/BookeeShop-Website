import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Button,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import FilterBarComponent from "../../../components/admin/FilterBarComponent";
import RoleTableComponent from "../../../components/admin/role/RoleTableComponent";
import {
  getRoles,
  deleteRole,
  changeStatus,
  changeMulti,
} from "../../../services/admin/roleService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const { hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchRoles = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getRoles();
      if (response.code === 200) {
        setRoles(response.roles);
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi tải danh sách nhóm quyền!"
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleFilter = (filters) => {
    fetchRoles(filters);
  };

  const handleSearch = (keyword) => {
    fetchRoles({ keyword });
  };

  const handleAddNew = () => {
    navigate(`/${ADMIN}/role/create`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await changeStatus(id, newStatus);
      if (response.code === 200) {
        setToastMessage("Cập nhật trạng thái thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchRoles();
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi cập nhật trạng thái!"
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteRole(id);
      if (response.code === 200) {
        setToastMessage("Xóa thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchRoles();
      } else {
        throw new Error(response.message || "Lỗi khi xóa nhóm quyền");
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi xóa nhóm quyền!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleSelectRoles = (newSelectedRoles) => {
    setSelectedRoles(newSelectedRoles);
  };

  const handleChangeMulti = async (key, value) => {
    if (!selectedRoles || selectedRoles.length === 0) {
      setToastMessage(
        "Vui lòng chọn ít nhất một sản phẩm để thực hiện hành động!"
      );
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${
          key === "delete"
            ? "xóa"
            : value === "active"
            ? "kích hoạt"
            : "dừng hoạt động"
        } ${selectedRoles.length} sản phẩm đã chọn không?`
      )
    ) {
      try {
        setMultiLoading(true);
        const response = await changeMulti(selectedRoles, key, value);
        if (response.code === 200) {
          setToastMessage(response.message || "Thay đổi thành công!");
          setToastVariant("success");
          setShowToast(true);
          setSelectedRoles([]);
          fetchRoles();
        } else {
          throw new Error(
            response.message || "Lỗi khi thay đổi nhiều sản phẩm"
          );
        }
      } catch (error) {
        setToastMessage(
          error.message || "Đã xảy ra lỗi khi thay đổi nhiều sản phẩm!"
        );
        setToastVariant("danger");
        setShowToast(true);
      } finally {
        setMultiLoading(false);
      }
    }
  };

  return (
    <Container fluid className="products-page">
      <h2 className="mb-4">Danh sách nhóm quyền</h2>

      <FilterBarComponent
        onFilter={handleFilter}
        onSearch={handleSearch}
        onAddNew={hasPermission("create_roles") ? handleAddNew : null}
      />

      {selectedRoles.length > 0 && (
        <div className="mb-3">
          {hasPermission("delete_roles") && (
            <Button
              variant="danger"
              onClick={() => handleChangeMulti("delete", true)}
              className="me-2"
              disabled={multiLoading}
            >
              {multiLoading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Xóa các mục đã chọn
            </Button>
          )}
          {hasPermission("update_roles") && (
            <>
              <Button
                variant="warning"
                onClick={() => handleChangeMulti("status", "inactive")}
                className="me-2"
                disabled={multiLoading}
              >
                {multiLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Dừng hoạt động
              </Button>
              <Button
                variant="success"
                onClick={() => handleChangeMulti("status", "active")}
                disabled={multiLoading}
              >
                {multiLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Kích hoạt
              </Button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <RoleTableComponent
          roles={roles}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSelect={handleSelectRoles}
          selectedRoles={selectedRoles}
        />
      )}
    </Container>
  );
};

export default RolesPage;
