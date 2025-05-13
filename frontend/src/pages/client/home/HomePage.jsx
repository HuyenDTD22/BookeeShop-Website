import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Pagination } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useLocation, useNavigate
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import homeService from "../../../services/client/homeService";
import bookService from "../../../services/client/bookService";
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import CategoryCardComponent from "../../../components/client/category/CategoryCardComponent";
import ResetPasswordModal from "../../../components/common/ResetPasswordModal";
import authService from "../../../services/client/authService";
import "../../../styles/client/pages/HomePage.css";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Thêm useNavigate
  const [booksFeatured, setBooksFeatured] = useState([]);
  const [booksNew, setBooksNew] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const itemsPerGroup = 5;

  const [showResetModal, setShowResetModal] = useState(false);
  const [email, setEmail] = useState("");

  // Lấy trạng thái từ navigate
  useEffect(() => {
    const { state } = location;
    if (state && state.showResetModal) {
      setShowResetModal(true);
      setEmail(state.email || "");
    }
  }, [location]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const data = await homeService.getHomepage();
        setBooksFeatured(data.booksFeatured || []);
        setBooksNew(data.booksNew || []);
        setCategories(data.layoutCategory || []);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  // Lấy tất cả sản phẩm với phân trang
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const data = await bookService.getAllBooks(currentPage, limit);
        setAllBooks(data.books || []);
        setTotalPages(Math.ceil(data.total / limit) || 1);
      } catch (error) {
        console.error("Failed to fetch all books:", error);
      }
    };
    fetchAllBooks();
  }, [currentPage]);

  const handleCategoryPrev = () => {
    setCategoryIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCategoryNext = () => {
    const maxIndex = Math.ceil(categories.length / itemsPerGroup) - 1;
    setCategoryIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handleFeaturedPrev = () => {
    setFeaturedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFeaturedNext = () => {
    const maxIndex = Math.ceil(booksFeatured.length / itemsPerGroup) - 1;
    setFeaturedIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handleNewPrev = () => {
    setNewIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNewNext = () => {
    const maxIndex = Math.ceil(booksNew.length / itemsPerGroup) - 1;
    setNewIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const getCurrentCategories = () => {
    const start = categoryIndex * itemsPerGroup;
    return categories.slice(start, start + itemsPerGroup);
  };

  const getCurrentFeaturedBooks = () => {
    const start = featuredIndex * itemsPerGroup;
    return booksFeatured.slice(start, start + itemsPerGroup);
  };

  const getCurrentNewBooks = () => {
    const start = newIndex * itemsPerGroup;
    return booksNew.slice(start, start + itemsPerGroup);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setShowResetModal(false);
  };

  return (
    <div className="homepage">
      <div className="banner position-relative mb-5">
        <img
          src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1744999124/ptlb7cxyr4rwvtnckvsc.jpg"
          alt="Book Banner"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
        <div className="banner-content position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Giảm giá 20% toàn bộ sách!</h1>
          <p className="lead">Chỉ trong tháng này, nhanh tay mua ngay!</p>
          <Button variant="danger" size="lg" as={Link} to="/book">
            Mua ngay
          </Button>
        </div>
      </div>

      <Container>
        <section className="category-section mb-5">
          <div className="section-block">
            <h2 className="section-title">Danh mục nổi bật</h2>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : (
              <div className="horizontal-scroll-container">
                <Button
                  variant="outline-primary"
                  className="scroll-button left"
                  onClick={handleCategoryPrev}
                  disabled={categoryIndex === 0}
                >
                  <FaArrowLeft />
                </Button>
                <div className="horizontal-scroll d-flex">
                  {getCurrentCategories().map((category) => (
                    <div
                      key={category._id}
                      style={{ width: "20%", padding: "0 8px" }}
                    >
                      <CategoryCardComponent
                        category={category}
                        link={`/book/${category.slug}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  className="scroll-button right"
                  onClick={handleCategoryNext}
                  disabled={
                    categoryIndex ===
                    Math.ceil(categories.length / itemsPerGroup) - 1
                  }
                >
                  <FaArrowRight />
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="featured-books mb-5">
          <div className="section-block">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : (
              <div className="horizontal-scroll-container">
                <Button
                  variant="outline-primary"
                  className="scroll-button left"
                  onClick={handleFeaturedPrev}
                  disabled={featuredIndex === 0}
                >
                  <FaArrowLeft />
                </Button>
                <div className="horizontal-scroll d-flex">
                  {getCurrentFeaturedBooks().map((book) => (
                    <div
                      key={book._id}
                      style={{ width: "20%", padding: "0 8px" }}
                    >
                      <BookCardComponent
                        book={book}
                        link={`/book/detail/${book.slug}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  className="scroll-button right"
                  onClick={handleFeaturedNext}
                  disabled={
                    featuredIndex ===
                    Math.ceil(booksFeatured.length / itemsPerGroup) - 1
                  }
                >
                  <FaArrowRight />
                </Button>
              </div>
            )}
            <div className="text-center mt-4">
              <Button variant="primary" as={Link} to="/book">
                Xem thêm
              </Button>
            </div>
          </div>
        </section>

        <section className="new-books mb-5">
          <div className="section-block">
            <h2 className="section-title">Sản phẩm mới nhất</h2>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : (
              <div className="horizontal-scroll-container">
                <Button
                  variant="outline-primary"
                  className="scroll-button left"
                  onClick={handleNewPrev}
                  disabled={newIndex === 0}
                >
                  <FaArrowLeft />
                </Button>
                <div className="horizontal-scroll d-flex">
                  {getCurrentNewBooks().map((book) => (
                    <div
                      key={book._id}
                      style={{ width: "20%", padding: "0 8px" }}
                    >
                      <BookCardComponent
                        book={book}
                        link={`/book/detail/${book.slug}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  className="scroll-button right"
                  onClick={handleNewNext}
                  disabled={
                    newIndex === Math.ceil(booksNew.length / itemsPerGroup) - 1
                  }
                >
                  <FaArrowRight />
                </Button>
              </div>
            )}
            <div className="text-center mt-4">
              <Button variant="primary" as={Link} to="/book">
                Xem thêm
              </Button>
            </div>
          </div>
        </section>

        <section className="all-books mb-5">
          <div className="section-block">
            <h2 className="section-title">Tất cả sản phẩm</h2>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : (
              <>
                <div className="d-flex flex-wrap">
                  {allBooks.map((book) => (
                    <div
                      key={book._id}
                      style={{
                        width: "20%",
                        padding: "0 8px",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <BookCardComponent
                        book={book}
                        link={`/book/detail/${book.slug}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </section>
      </Container>
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={handleCloseModal}
        email={email}
        authService={authService}
        navigate={navigate} // Thêm navigate
        redirectPath="/"
      />
    </div>
  );
};

export default HomePage;
