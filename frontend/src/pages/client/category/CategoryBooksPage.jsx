// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Alert } from "react-bootstrap";
// import bookService from "../../../services/client/bookService";
// import BookCardComponent from "../../../components/client/product/BookCardComponent";
// import PaginationComponent from "../../../components/common/PaginationComponent";
// import "../../../styles/client/pages/HomePage.css";

// const CategoryBooksPage = () => {
//   const { slugCategory } = useParams();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categoryTitle, setCategoryTitle] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   const limit = 10;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const response = await bookService.getCategoryBooks(slugCategory);
//         const totalItemsCount = response.newBooks.length;
//         const totalPagesCount = Math.ceil(totalItemsCount / limit);

//         setBooks(
//           response.newBooks.slice(
//             (currentPage - 1) * limit,
//             currentPage * limit
//           )
//         );
//         setTotalItems(totalItemsCount);
//         setTotalPages(totalPagesCount);
//         setCategoryTitle(response.category.title || "Danh mục");
//       } catch (err) {
//         setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [slugCategory, currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <Container className="my-5">
//       <section className="all-books mb-5">
//         <div className="section-block">
//           <h2 className="section-title text-center">
//             Sách thuộc danh mục {categoryTitle}
//           </h2>

//           {loading && <div className="text-center">Đang tải...</div>}

//           {error && <Alert variant="danger">{error}</Alert>}

//           {!loading && !error && books.length === 0 && (
//             <Alert variant="info">Không có sách nào trong danh mục này.</Alert>
//           )}

//           {!loading && !error && books.length > 0 && (
//             <div className="d-flex flex-wrap">
//               {books.map((book) => (
//                 <div
//                   key={book._id}
//                   style={{
//                     width: "20%",
//                     padding: "0 8px",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   <BookCardComponent
//                     book={book}
//                     link={`/book/detail/${book.slug}`}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="d-flex justify-content-center mt-4">
//             <PaginationComponent
//               currentPage={currentPage}
//               totalPages={totalPages}
//               totalItems={totalItems}
//               loading={loading}
//               onPageChange={handlePageChange}
//             />
//           </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    rating: "",
    sortBy: "",
    sortOrder: "",
  });

  const limit = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getCategoryBooks(slugCategory, {
          ...filters,
          page: currentPage,
          limit,
        });
        setBooks(response.books || []);
        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil(response.total / limit));
        setCategoryTitle(response.category?.title || "Danh mục");
      } catch (err) {
        setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [slugCategory, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <Row>
              {books.map((book) => (
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
          )}

          <div className="d-flex justify-content-center mt-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default CategoryBooksPage;
