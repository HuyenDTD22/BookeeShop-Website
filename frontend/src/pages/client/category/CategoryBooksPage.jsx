// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Alert, Row, Col } from "react-bootstrap";
// import bookService from "../../../services/client/bookService";
// import BookCardComponent from "../../../components/client/product/BookCardComponent";
// import BookFilterSortComponent from "../../../components/client/product/BookFilterSortComponent";
// import "../../../styles/client/pages/HomePage.css";

// const CategoryBooksPage = () => {
//   const { slugCategory } = useParams();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categoryTitle, setCategoryTitle] = useState("");
//   const [filters, setFilters] = useState({
//     rating: "",
//     sortBy: "",
//     sortOrder: "",
//   });

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const response = await bookService.getCategoryBooks(
//           slugCategory,
//           filters
//         );
//         setBooks(response.books || []);
//         setCategoryTitle(response.category?.title || "Danh mục");
//       } catch (err) {
//         setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [slugCategory, filters]);

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   return (
//     <Container className="my-5">
//       <section className="all-books mb-5">
//         <div className="section-block">
//           <h2 className="section-title text-center">
//             Sách thuộc danh mục {categoryTitle}
//           </h2>

//           {/* Thanh lọc và sắp xếp */}
//           <BookFilterSortComponent
//             onFilterChange={handleFilterChange}
//             initialFilters={filters}
//           />

//           {loading && <div className="text-center">Đang tải...</div>}

//           {error && <Alert variant="danger">{error}</Alert>}

//           {!loading && !error && books.length === 0 && (
//             <Alert variant="info">Không có sách nào trong danh mục này.</Alert>
//           )}

//           {!loading && !error && books.length > 0 && (
//             <Row>
//               {books.map((book) => (
//                 <Col
//                   key={book._id}
//                   xs={6}
//                   sm={4}
//                   md={3}
//                   lg={2.4}
//                   className="mb-4"
//                 >
//                   <BookCardComponent
//                     book={book}
//                     link={`/book/detail/${book.slug}`}
//                   />
//                 </Col>
//               ))}
//             </Row>
//           )}
//         </div>
//       </section>
//     </Container>
//   );
// };

// export default CategoryBooksPage;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Alert, Row, Col } from "react-bootstrap";
import bookService from "../../../services/client/bookService";
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import BookFilterSortComponent from "../../../components/client/product/BookFilterSortComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import "../../../styles/client/pages/HomePage.css";

const CategoryBooksPage = () => {
  const { slugCategory } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [filters, setFilters] = useState({
    rating: "",
    sortBy: "",
    sortOrder: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12; // Số sách mỗi trang

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getCategoryBooks(
          slugCategory,
          filters
        );
        setBooks(response.books || []);
        setCategoryTitle(response.category?.title || "Danh mục");
        setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc hoặc danh mục
      } catch (err) {
        setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [slugCategory, filters]);

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
      <section className="all-books mb-5">
        <div className="section-block">
          <h2 className="section-title text-center">
            Sách thuộc danh mục {categoryTitle}
          </h2>

          {/* Thanh lọc và sắp xếp */}
          <BookFilterSortComponent
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {loading && <div className="text-center">Đang tải...</div>}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && books.length === 0 && (
            <Alert variant="info">Không có sách nào trong danh mục này.</Alert>
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

export default CategoryBooksPage;
