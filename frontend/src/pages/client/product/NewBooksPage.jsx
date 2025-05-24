import React, { useState, useEffect } from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import bookService from "../../../services/client/bookService";
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import BookFilterSortComponent from "../../../components/client/product/BookFilterSortComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import "../../../styles/client/pages/HomePage.css";

const NewBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rating: "",
    sortBy: "",
    sortOrder: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getNewBooks(filters);
        setBooks(response.books || []);
        setCurrentPage(1);
      } catch (err) {
        setError("Không thể tải danh sách sách mới. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính toán sách hiển thị trên trang hiện tại
  const totalBooks = books.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <Container className="my-5">
      <section className="new-books mb-5">
        <div className="section-block">
          <h2 className="section-title text-center">Sản phẩm mới nhất</h2>

          {/* Thanh lọc và sắp xếp */}
          <BookFilterSortComponent
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {loading && <div className="text-center">Đang tải...</div>}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && books.length === 0 && (
            <Alert variant="info">Không có sách mới nào.</Alert>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <Row>
                {currentBooks.map((book) => (
                  <Col
                    key={book._id}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    className="mb-4"
                  >
                    <BookCardComponent
                      book={book}
                      link={`/book/detail/${book.slug}`}
                    />
                  </Col>
                ))}
              </Row>
              <PaginationComponent
                className="pagination-centered"
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalBooks}
                loading={loading}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
    </Container>
  );
};

export default NewBooksPage;
