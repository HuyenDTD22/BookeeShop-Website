import React, { useEffect, useState } from "react";
import { Container, Button, Pagination } from "react-bootstrap";
import FilterBarComponent from "../../components/admin/FilterBarComponent";
import ProductTableComponent from "../../components/admin/ProductTableComponent";
import {
  getBooks,
  changeStatus,
  deleteBook,
  changeMulti,
} from "../../services/admin/bookService";
import { useNavigate } from "react-router-dom";

const ADMIN = process.env.REACT_APP_ADMIN;

const ProductsPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limitItems = 10; // Số sản phẩm mỗi trang (theo backend)

  const fetchBooks = async (params = {}) => {
    try {
      const response = await getBooks({ ...params, page: currentPage });
      if (response.code === 200) {
        setBooks(response.books);
        const totalItems = response.books.length; // Giả sử backend trả về totalItems
        setTotalPages(Math.ceil(totalItems / limitItems));
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleFilter = (filters) => {
    setCurrentPage(1); // Reset về trang 1 khi lọc
    fetchBooks(filters);
  };

  const handleSearch = (keyword) => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    fetchBooks({ keyword });
  };

  const handleAddNew = () => {
    navigate(`/${ADMIN}/book/create`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeStatus(id, newStatus);
      fetchBooks(); // Làm mới danh sách
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks(); // Làm mới danh sách
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleSelectBooks = (newSelectedBooks) => {
    setSelectedBooks(newSelectedBooks);
  };

  const handleChangeMulti = async (key, value) => {
    try {
      await changeMulti(selectedBooks, key, value);
      setSelectedBooks([]); // Reset lựa chọn
      fetchBooks(); // Làm mới danh sách
    } catch (error) {
      console.error("Failed to change multi:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Container fluid className="products-page">
      <h2 className="mb-4">Danh sách sản phẩm</h2>

      <FilterBarComponent
        onFilter={handleFilter}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      {selectedBooks.length > 0 && (
        <div className="mb-3">
          <Button
            variant="danger"
            onClick={() => handleChangeMulti("delete", true)}
            className="me-2"
          >
            Xóa các mục đã chọn
          </Button>
          <Button
            variant="warning"
            onClick={() => handleChangeMulti("status", "inactive")}
            className="me-2"
          >
            Dừng hoạt động
          </Button>
          <Button
            variant="success"
            onClick={() => handleChangeMulti("status", "active")}
          >
            Kích hoạt
          </Button>
        </div>
      )}

      <ProductTableComponent
        books={books}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onSelect={handleSelectBooks}
        selectedBooks={selectedBooks}
      />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
      </div>
    </Container>
  );
};

export default ProductsPage;
