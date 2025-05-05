import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { api } from "../../../services/client/bookService";
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import CategoryCardComponent from "../../../components/client/category/CategoryCardComponent";
import "../../../styles/client/pages/HomePage.css";

const HomePage = () => {
  const [booksFeatured, setBooksFeatured] = useState([]);
  const [booksNew, setBooksNew] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Số sản phẩm mỗi trang (5 sản phẩm/hàng, 2 hàng/trang)

  // Trạng thái cho nhóm hiển thị (5 mục mỗi lần)
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const itemsPerGroup = 5; // Số mục mỗi nhóm (5 mục)

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const data = await api.getHomepage();
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
        const data = await api.getAllBooks(currentPage, limit);
        setAllBooks(data.books || []);
        setTotalPages(Math.ceil(data.total / limit) || 1);
      } catch (error) {
        console.error("Failed to fetch all books:", error);
      }
    };
    fetchAllBooks();
  }, [currentPage]);

  // Hàm điều hướng nhóm danh mục
  const handleCategoryPrev = () => {
    setCategoryIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCategoryNext = () => {
    const maxIndex = Math.ceil(categories.length / itemsPerGroup) - 1;
    setCategoryIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // Hàm điều hướng nhóm sản phẩm (Sản phẩm nổi bật)
  const handleFeaturedPrev = () => {
    setFeaturedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFeaturedNext = () => {
    const maxIndex = Math.ceil(booksFeatured.length / itemsPerGroup) - 1;
    setFeaturedIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // Hàm điều hướng nhóm sản phẩm (Sản phẩm mới nhất)
  const handleNewPrev = () => {
    setNewIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNewNext = () => {
    const maxIndex = Math.ceil(booksNew.length / itemsPerGroup) - 1;
    setNewIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // Lấy nhóm hiện tại
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

  // Hàm chuyển trang (Tất cả sản phẩm)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="homepage">
      {/* Banner */}
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
        {/* Danh mục nổi bật (Hàng ngang, 5 danh mục, có điều hướng) */}
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
                        link={`/book/${category.slug}`} // Bạn có thể thay đổi đường dẫn tại đây
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
            {/* <div className="text-center mt-4">
              <Button variant="primary" as={Link} to="/categories">
                Xem thêm
              </Button>
            </div> */}
          </div>
        </section>

        {/* Sản phẩm nổi bật (Hàng ngang, 5 sản phẩm) */}
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
                        link={`/book/detail/${book.slug}`} // Bạn có thể thay đổi đường dẫn tại đây
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

        {/* Sản phẩm mới nhất (Hàng ngang, 5 sản phẩm) */}
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
                        link={`/book/detail/${book.slug}`} // Bạn có thể thay đổi đường dẫn tại đây
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

        {/* Tất cả sản phẩm (Grid với phân trang, 5 sản phẩm/hàng) */}
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
                        link={`/book/detail/${book.slug}`} // Bạn có thể thay đổi đường dẫn tại đây
                      />
                    </div>
                  ))}
                </div>
                {/* Phân trang */}
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
    </div>
  );
};

export default HomePage;
