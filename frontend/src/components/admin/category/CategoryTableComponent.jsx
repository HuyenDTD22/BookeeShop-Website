import React, { useState, useContext } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../assets/styles/ProductTableComponent.css";
import ConfirmModalComponent from "../../common/ConfirmModalComponent";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const CategoryTableComponent = ({
  categories,
  onStatusChange,
  onDelete,
  onSelect,
  selectedCategories,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      setLoadingDelete(categoryToDelete._id);
      onDelete(categoryToDelete._id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
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
    const newSelectedCategorys = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];
    onSelect(newSelectedCategorys);
  };

  // THÊM: Hàm tính tổng số danh mục (bao gồm danh mục con) để kiểm tra checkbox "Chọn tất cả"
  const getTotalCategories = (categories) => {
    let total = 0;
    const countCategories = (nodes) => {
      nodes.forEach((node) => {
        total++;
        if (node.children && node.children.length > 0) {
          countCategories(node.children);
        }
      });
    };
    countCategories(categories);
    return total;
  };

  // THÊM: Hàm lấy tất cả ID danh mục (bao gồm danh mục con)
  const getAllCategoryIds = (categories) => {
    let ids = [];
    const collectIds = (nodes) => {
      nodes.forEach((node) => {
        ids.push(node._id);
        if (node.children && node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    collectIds(categories);
    return ids;
  };

  let indexCounter = 0;

  // THÊM: Hàm đệ quy để hiển thị danh mục dạng cây
  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => {
      indexCounter++;
      const currentIndex = indexCounter;
      return (
        <React.Fragment key={category._id}>
          <tr>
            <td>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleSelect(category._id)}
              />
            </td>
            <td>{currentIndex}</td>
            <td style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0
                ? `-- ${category.title || "Không có tiêu đề"}`
                : category.title || "Không có tiêu đề"}
            </td>
            <td>{category.position ?? "N/A"}</td>
            <td>
              <Button
                variant={category.status === "active" ? "success" : "danger"}
                onClick={() =>
                  handleShowStatusModal(
                    category._id,
                    category.status === "active" ? "inactive" : "active"
                  )
                }
                disabled={
                  loadingStatus === category._id ||
                  !hasPermission("update_categories")
                }
              >
                {loadingStatus === category._id ? (
                  <Spinner animation="border" size="sm" />
                ) : category.status === "active" ? (
                  "Hoạt động"
                ) : (
                  "Dừng hoạt động"
                )}
              </Button>
            </td>
            <td>{category.accountFullName || "N/A"}</td>
            <td>
              {hasPermission("update_categories") && (
                <Link to={`/${ADMIN}/category/edit/${category._id}`}>
                  <Button variant="warning" size="sm" className="me-1">
                    <FaEdit />
                  </Button>
                </Link>
              )}
              {hasPermission("delete_categories") && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(category)}
                  disabled={loadingDelete === category._id}
                >
                  {loadingDelete === category._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaTrash />
                  )}
                </Button>
              )}
            </td>
          </tr>
          {category.children &&
            category.children.length > 0 &&
            renderCategories(category.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Table striped bordered hover className="product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelect(getAllCategoryIds(categories));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedCategories.length ===
                    getTotalCategories(categories) && categories.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* THÊM: Thông báo khi danh sách rỗng */}
          {categories.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Không có danh mục nào để hiển thị
              </td>
            </tr>
          ) : (
            renderCategories(categories)
          )}
        </tbody>
      </Table>

      {/* Modal xác nhận xóa */}
      <ConfirmModalComponent
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa danh mục "${
          categoryToDelete?.title || "Không có tiêu đề"
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
        }" cho danh mục này không?`}
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

export default CategoryTableComponent;
