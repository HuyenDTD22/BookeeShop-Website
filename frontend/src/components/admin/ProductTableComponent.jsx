import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../assets/styles/ProductTableComponent.css";

const ADMIN = process.env.REACT_APP_ADMIN;

const ProductTableComponent = ({
  books,
  onStatusChange,
  onDelete,
  onSelect,
  selectedBooks,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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
              <td>{index + 1}</td>
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
                    onStatusChange(
                      book._id,
                      book.status === "active" ? "inactive" : "active"
                    )
                  }
                >
                  {book.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                </Button>
              </td>
              <td>{book.accountFullName || "N/A"}</td>
              <td>
                <Link to={`/${ADMIN}/book/detail/${book._id}`}>
                  <Button variant="info" size="sm" className="me-1">
                    <FaEye />
                  </Button>
                </Link>
                <Link to={`/${ADMIN}/book/edit/${book._id}`}>
                  <Button variant="warning" size="sm" className="me-1">
                    <FaEdit />
                  </Button>
                </Link>
                <Link to={`/${ADMIN}/book/delete/${book._id}`}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteModal(book)}
                  >
                    <FaTrash />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa sản phẩm "{bookToDelete?.title}" không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductTableComponent;
