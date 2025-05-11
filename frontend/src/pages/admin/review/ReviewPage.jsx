import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import { getBooks } from "../../../services/admin/bookService";
import ReviewDetailModal from "./ReviewDetailModal";
import ratingService from "../../../services/admin/ratingService";
import commentService from "../../../services/admin/commentService";
import PaginationComponent from "../../../components/common/PaginationComponent";
import StarRatingComponent from "../../../components/common/StarRatingComponent"; // Import StarRatingComponent

const ReviewPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default"); // Mặc định là "Sắp xếp mặc định"
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getBooks({ keyword: searchTerm });
        setBooks(response.books || []);
        setFilteredBooks(response.books || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm]);

  // Sắp xếp sách
  const handleSort = (sortValue) => {
    setSortOption(sortValue);
    setCurrentPage(1); // Reset về trang 1 khi sắp xếp

    if (sortValue === "default") {
      // Khôi phục danh sách ban đầu từ books
      setFilteredBooks([...books]);
      return;
    }

    const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (sortValue === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortValue === "title-desc") {
        return b.title.localeCompare(a.title);
      } else if (sortValue === "rating-asc") {
        return (a.rating_mean || 0) - (b.rating_mean || 0);
      } else if (sortValue === "rating-desc") {
        return (b.rating_mean || 0) - (a.rating_mean || 0);
      }
      return 0;
    });
    setFilteredBooks(sortedBooks);
  };

  // Tìm kiếm sách
  const handleSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xem chi tiết sách
  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  // Xóa tất cả đánh giá và bình luận của sách (xóa mềm)
  const handleDeleteAll = async (bookId) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa tất cả đánh giá và bình luận của sách này?"
      )
    ) {
      try {
        await ratingService.deleteAllRatings(bookId);
        await commentService.deleteAllComments(bookId);
        setBooks(books.filter((book) => book._id !== bookId));
        setFilteredBooks(filteredBooks.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error("Error deleting reviews:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="fs-3 mb-4">Quản lý đánh giá</h1>

      {/* Thanh lọc */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Ô sắp xếp */}
        <Form.Select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
          style={{ width: "250px", marginRight: "20px" }}
        >
          <option value="default">Sắp xếp</option>
          <option value="title-asc">Sắp xếp theo tên tăng dần</option>
          <option value="title-desc">Sắp xếp theo tên giảm dần</option>
          <option value="rating-asc">Sắp xếp theo số sao tăng dần</option>
          <option value="rating-desc">Sắp xếp theo số sao giảm dần</option>
        </Form.Select>

        {/* Ô tìm kiếm với nút tìm kiếm */}
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px", marginRight: "10px" }}
          />
          <Button variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Bảng sách */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Đánh giá sao</th>
                <th>Số lượng bình luận</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr key={book._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>
                    <StarRatingComponent rating={book.rating_mean || 0} />
                  </td>
                  <td>{book.commentCount || 0}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewDetails(book)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAll(book._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Component phân trang */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal chi tiết đánh giá */}
      {selectedBook && (
        <ReviewDetailModal
          show={!!selectedBook}
          onHide={() => setSelectedBook(null)}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default ReviewPage;
