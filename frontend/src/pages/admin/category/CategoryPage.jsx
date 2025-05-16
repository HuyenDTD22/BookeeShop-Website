import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Button,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import FilterBarComponent from "../../../components/admin/FilterBarComponent";
import CategoryTableComponent from "../../../components/admin/category/CategoryTableComponent";
import {
  getCategory,
  deleteCategory,
  changeMulti,
  changeStatus,
} from "../../../services/admin/categoryService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const { hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCategories = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getCategory(params);
      if (response.code === 200) {
        setCategories(response.categories);
      } else {
        throw new Error("Dữ liệu danh mục không hợp lệ!");
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi tải danh sách danh mục!"
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilter = (filters) => {
    fetchCategories(filters);
  };

  const handleSearch = (keyword) => {
    fetchCategories({ keyword });
  };

  const handleAddNew = () => {
    navigate(`/${ADMIN}/category/create`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response.code === 200) {
        setToastMessage("Xóa thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchCategories();
      } else {
        throw new Error(response.message || "Lỗi khi xóa danh mục");
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi xóa danh mục!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleSelectCategories = (newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await changeStatus(id, newStatus);
      if (response.code === 200) {
        setToastMessage("Cập nhật trạng thái thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchCategories();
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

  const handleChangeMulti = async (key, value) => {
    if (!selectedCategories || selectedCategories.length === 0) {
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
        } ${selectedCategories.length} sản phẩm đã chọn không?`
      )
    ) {
      try {
        setMultiLoading(true);
        const response = await changeMulti(selectedCategories, key, value);
        if (response.code === 200) {
          setToastMessage(response.message || "Thay đổi thành công!");
          setToastVariant("success");
          setShowToast(true);
          setSelectedCategories([]);
          fetchCategories();
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
      <h2 className="mb-4">Danh sách danh mục</h2>

      <FilterBarComponent
        onFilter={handleFilter}
        onSearch={handleSearch}
        onAddNew={hasPermission("create_categories") ? handleAddNew : null}
      />

      {selectedCategories.length > 0 && (
        <div className="mb-3">
          {hasPermission("delete_categories") && (
            <Button
              variant="danger"
              onClick={() => handleChangeMulti("delete", true)}
              className="me-2"
              disabled={multiLoading}
            >
              {multiLoading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Xóa các mục đã chọn ({selectedCategories.length})
            </Button>
          )}
          {hasPermission("update_categories") && (
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
        <CategoryTableComponent
          categories={categories}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSelect={handleSelectCategories}
          selectedCategories={selectedCategories}
        />
      )}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={10000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success"
                ? "Thành công"
                : toastVariant === "danger"
                ? "Lỗi"
                : "Cảnh báo"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default CategoriesPage;
