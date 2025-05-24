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
import PaginationComponent from "../../../components/common/PaginationComponent";
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
  const [displayedRoles, setDisplayedRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const { hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();
  const limitItems = 4;

  const fetchRoles = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getRoles(params);
      console.log("Fetch roles response:", response); // Debug
      if (response.code === 200) {
        const allRoles = response.roles;
        setRoles(allRoles);
        setTotalItems(allRoles.length);
        setTotalPages(Math.ceil(allRoles.length / limitItems) || 1);

        const startIndex = (currentPage - 1) * limitItems;
        const endIndex = startIndex + limitItems;
        setDisplayedRoles(allRoles.slice(startIndex, endIndex));
      } else {
        throw new Error(response.message || "Lỗi khi lấy danh sách nhóm quyền");
      }
    } catch (error) {
      console.error("Fetch roles error:", error);
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

  useEffect(() => {
    const startIndex = (currentPage - 1) * limitItems;
    const endIndex = startIndex + limitItems;
    setDisplayedRoles(roles.slice(startIndex, endIndex));
  }, [currentPage, roles]);

  const handleFilter = (filters) => {
    setCurrentPage(1);
    fetchRoles(filters);
  };

  const handleSearch = (keyword) => {
    setCurrentPage(1);
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
        "Vui lòng chọn ít nhất một nhóm quyền để thực hiện hành động!"
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
        } ${selectedRoles.length} nhóm quyền đã chọn không?`
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
            response.message || "Lỗi khi thay đổi nhiều nhóm quyền"
          );
        }
      } catch (error) {
        setToastMessage(
          error.message || "Đã xảy ra lỗi khi thay đổi nhiều nhóm quyền!"
        );
        setToastVariant("danger");
        setShowToast(true);
      } finally {
        setMultiLoading(false);
      }
    }
  };

  return (
    <Container fluid className="roles-page">
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
      ) : roles.length === 0 ? (
        <div className="text-center my-4">
          <p>Không có nhóm quyền nào để hiển thị.</p>
        </div>
      ) : (
        <>
          <RoleTableComponent
            roles={displayedRoles}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onSelect={handleSelectRoles}
            selectedRoles={selectedRoles}
            currentPage={currentPage}
            limitItems={limitItems}
          />
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              loading={loading}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Thành công" : "Lỗi"}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default RolesPage;
