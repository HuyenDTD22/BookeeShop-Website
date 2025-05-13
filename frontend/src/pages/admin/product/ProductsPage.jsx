import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Button,
  Pagination,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import FilterBarComponent from "../../../components/admin/FilterBarComponent";
import ProductTableComponent from "../../../components/admin/product/ProductTableComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import {
  getBooks,
  changeStatus,
  deleteBook,
  changeMulti,
} from "../../../services/admin/bookService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const ProductsPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
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

  const fetchBooks = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getBooks({ ...params, page: currentPage });
      if (response.code === 200) {
        setBooks(response.books);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi tải danh sách sách!");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleFilter = (filters) => {
    setCurrentPage(1);
    fetchBooks(filters);
  };

  const handleSearch = (keyword) => {
    setCurrentPage(1);
    fetchBooks({ keyword });
  };

  const handleAddNew = () => {
    navigate(`/${ADMIN}/book/create`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await changeStatus(id, newStatus);
      if (response.code === 200) {
        setToastMessage("Cập nhật trạng thái thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchBooks();
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
      const response = await deleteBook(id);
      if (response.code === 200) {
        setToastMessage("Xóa thành công!");
        setToastVariant("success");
        setShowToast(true);
        fetchBooks();
      } else {
        throw new Error(response.message || "Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi xóa sản phẩm!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleSelectBooks = (newSelectedBooks) => {
    setSelectedBooks(newSelectedBooks);
  };

  const handleChangeMulti = async (key, value) => {
    if (!selectedBooks || selectedBooks.length === 0) {
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
        } ${selectedBooks.length} sản phẩm đã chọn không?`
      )
    ) {
      try {
        setMultiLoading(true);
        const response = await changeMulti(selectedBooks, key, value);
        if (response.code === 200) {
          setToastMessage(response.message || "Thay đổi thành công!");
          setToastVariant("success");
          setShowToast(true);
          setSelectedBooks([]);
          fetchBooks();
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
      <h2 className="mb-4">Danh sách sản phẩm</h2>

      <FilterBarComponent
        onFilter={handleFilter}
        onSearch={handleSearch}
        onAddNew={hasPermission("create_books") ? handleAddNew : null}
      />

      {selectedBooks.length > 0 && (
        <div className="mb-3">
          {hasPermission("delete_books") && (
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
          {hasPermission("update_books") && (
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
        <ProductTableComponent
          books={books}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onSelect={handleSelectBooks}
          selectedBooks={selectedBooks}
          currentPage={currentPage}
          limitItems={limitItems}
        />
      )}

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          loading={loading}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </Container>
  );
};

export default ProductsPage;
