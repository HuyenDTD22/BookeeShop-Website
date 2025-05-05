import React, { useState, useContext } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/admin/component/ProductTableComponent.css";
import ConfirmModalComponent from "../../common/ConfirmModalComponent";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const ProductTableComponent = ({
  books,
  onStatusChange,
  onDelete,
  onSelect,
  selectedBooks,
  currentPage,
  limitItems,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  const handleShowDeleteModal = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (bookToDelete) {
      onDelete(bookToDelete._id);
      setShowDeleteModal(false);
      setBookToDelete(null);
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
    const newSelectedBooks = selectedBooks.includes(id)
      ? selectedBooks.filter((bookId) => bookId !== id)
      : [...selectedBooks, id];
    onSelect(newSelectedBooks);
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
                    onSelect(books.map((book) => book._id));
                  } else {
                    onSelect([]);
                  }
                }}
                checked={
                  selectedBooks.length === books.length && books.length > 0
                }
              />
            </th>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book._id)}
                  onChange={() => handleSelect(book._id)}
                />
              </td>
              <td>{(currentPage - 1) * limitItems + index + 1}</td>
              <td>
                <img
                  src={book.thumbnail || "https://via.placeholder.com/50"}
                  alt={book.title}
                  className="book-thumbnail"
                />
              </td>
              <td>{book.title}</td>
              <td>{book.price}$</td>
              <td>{book.position}</td>
              <td>
                <Button
                  variant={book.status === "active" ? "success" : "danger"}
                  onClick={() =>
                    handleShowStatusModal(
                      book._id,
                      book.status === "active" ? "inactive" : "active"
                    )
                  }
                  disabled={
                    loadingStatus === book._id || !hasPermission("update_books")
                  }
                >
                  {loadingStatus === book._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : book.status === "active" ? (
                    "Hoạt động"
                  ) : (
                    "Dừng hoạt động"
                  )}
                </Button>
              </td>
              <td>{book.accountFullName || "N/A"}</td>
              <td>
                {hasPermission("read_books") && (
                  <Link to={`/${ADMIN}/book/detail/${book._id}`}>
                    <Button variant="info" size="sm" className="me-1">
                      <FaEye />
                    </Button>
                  </Link>
                )}
                {hasPermission("update_books") && (
                  <Link to={`/${ADMIN}/book/edit/${book._id}`}>
                    <Button variant="warning" size="sm" className="me-1">
                      <FaEdit />
                    </Button>
                  </Link>
                )}
                {hasPermission("delete_books") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(book)}
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
          setBookToDelete(null);
        }}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa sản phẩm "${
          bookToDelete?.title || "Không có tiêu đề"
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
        }" cho sản phẩm này không?`}
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

export default ProductTableComponent;
