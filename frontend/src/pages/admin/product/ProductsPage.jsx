// import React, { useEffect, useState, useContext } from "react";
// import {
//   Container,
//   Button,
//   Pagination,
//   Toast,
//   ToastContainer,
//   Spinner,
// } from "react-bootstrap";
// import FilterBarComponent from "../../../components/admin/FilterBarComponent";
// import ProductTableComponent from "../../../components/admin/product/ProductTableComponent";
// import PaginationComponent from "../../../components/common/PaginationComponent";
// import {
//   getBooks,
//   changeStatus,
//   deleteBook,
//   changeMulti,
// } from "../../../services/admin/bookService";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";

// const ADMIN = process.env.REACT_APP_ADMIN;

// const ProductsPage = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedBooks, setSelectedBooks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [multiLoading, setMultiLoading] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState("success");
//   const { hasPermission } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const limitItems = 4;

//   const fetchBooks = async (params = {}) => {
//     try {
//       setLoading(true);
//       const response = await getBooks({ ...params, page: currentPage });
//       if (response.code === 200) {
//         setBooks(response.books);
//         setTotalPages(response.pagination?.totalPages || 1);
//         setTotalItems(response.pagination?.totalItems || 0);
//       }
//     } catch (error) {
//       setToastMessage(error.message || "Đã xảy ra lỗi khi tải danh sách sách!");
//       setToastVariant("danger");
//       setShowToast(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, [currentPage]);

//   const handleFilter = (filters) => {
//     setCurrentPage(1);
//     fetchBooks(filters);
//   };

//   const handleSearch = (keyword) => {
//     setCurrentPage(1);
//     fetchBooks({ keyword });
//   };

//   const handleAddNew = () => {
//     navigate(`/${ADMIN}/book/create`);
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const response = await changeStatus(id, newStatus);
//       if (response.code === 200) {
//         setToastMessage("Cập nhật trạng thái thành công!");
//         setToastVariant("success");
//         setShowToast(true);
//         fetchBooks();
//       } else {
//         throw new Error(response.message || "Lỗi khi cập nhật trạng thái");
//       }
//     } catch (error) {
//       setToastMessage(
//         error.message || "Đã xảy ra lỗi khi cập nhật trạng thái!"
//       );
//       setToastVariant("danger");
//       setShowToast(true);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await deleteBook(id);
//       if (response.code === 200) {
//         setToastMessage("Xóa thành công!");
//         setToastVariant("success");
//         setShowToast(true);
//         fetchBooks();
//       } else {
//         throw new Error(response.message || "Lỗi khi xóa sản phẩm");
//       }
//     } catch (error) {
//       setToastMessage(error.message || "Đã xảy ra lỗi khi xóa sản phẩm!");
//       setToastVariant("danger");
//       setShowToast(true);
//     }
//   };

//   const handleSelectBooks = (newSelectedBooks) => {
//     setSelectedBooks(newSelectedBooks);
//   };

//   const handleChangeMulti = async (key, value) => {
//     if (!selectedBooks || selectedBooks.length === 0) {
//       setToastMessage(
//         "Vui lòng chọn ít nhất một sản phẩm để thực hiện hành động!"
//       );
//       setToastVariant("warning");
//       setShowToast(true);
//       return;
//     }

//     if (
//       window.confirm(
//         `Bạn có chắc chắn muốn ${
//           key === "delete"
//             ? "xóa"
//             : value === "active"
//             ? "kích hoạt"
//             : "dừng hoạt động"
//         } ${selectedBooks.length} sản phẩm đã chọn không?`
//       )
//     ) {
//       try {
//         setMultiLoading(true);
//         const response = await changeMulti(selectedBooks, key, value);
//         if (response.code === 200) {
//           setToastMessage(response.message || "Thay đổi thành công!");
//           setToastVariant("success");
//           setShowToast(true);
//           setSelectedBooks([]);
//           fetchBooks();
//         } else {
//           throw new Error(
//             response.message || "Lỗi khi thay đổi nhiều sản phẩm"
//           );
//         }
//       } catch (error) {
//         setToastMessage(
//           error.message || "Đã xảy ra lỗi khi thay đổi nhiều sản phẩm!"
//         );
//         setToastVariant("danger");
//         setShowToast(true);
//       } finally {
//         setMultiLoading(false);
//       }
//     }
//   };

//   return (
//     <Container fluid className="products-page">
//       <h2 className="mb-4">Danh sách sản phẩm</h2>

//       <FilterBarComponent
//         onFilter={handleFilter}
//         onSearch={handleSearch}
//         onAddNew={hasPermission("create_books") ? handleAddNew : null}
//       />

//       {selectedBooks.length > 0 && (
//         <div className="mb-3">
//           {hasPermission("delete_books") && (
//             <Button
//               variant="danger"
//               onClick={() => handleChangeMulti("delete", true)}
//               className="me-2"
//               disabled={multiLoading}
//             >
//               {multiLoading ? (
//                 <Spinner animation="border" size="sm" className="me-2" />
//               ) : null}
//               Xóa các mục đã chọn
//             </Button>
//           )}
//           {hasPermission("update_books") && (
//             <>
//               <Button
//                 variant="warning"
//                 onClick={() => handleChangeMulti("status", "inactive")}
//                 className="me-2"
//                 disabled={multiLoading}
//               >
//                 {multiLoading ? (
//                   <Spinner animation="border" size="sm" className="me-2" />
//                 ) : null}
//                 Dừng hoạt động
//               </Button>
//               <Button
//                 variant="success"
//                 onClick={() => handleChangeMulti("status", "active")}
//                 disabled={multiLoading}
//               >
//                 {multiLoading ? (
//                   <Spinner animation="border" size="sm" className="me-2" />
//                 ) : null}
//                 Kích hoạt
//               </Button>
//             </>
//           )}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center my-4">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <ProductTableComponent
//           books={books}
//           onStatusChange={handleStatusChange}
//           onDelete={handleDelete}
//           onSelect={handleSelectBooks}
//           selectedBooks={selectedBooks}
//           currentPage={currentPage}
//           limitItems={limitItems}
//         />
//       )}

//       {totalPages > 0 && (
//         <PaginationComponent
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalItems={totalItems}
//           loading={loading}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       )}
//     </Container>
//   );
// };

// export default ProductsPage;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   Container,
//   Button,
//   Toast,
//   ToastContainer,
//   Spinner,
// } from "react-bootstrap";
// import BookFilterSortComponent from "../../../components/client/product/BookFilterSortComponent";
// import ProductTableComponent from "../../../components/admin/product/ProductTableComponent";
// import PaginationComponent from "../../../components/common/PaginationComponent";
// import {
//   getBooks,
//   changeStatus,
//   deleteBook,
//   changeMulti,
// } from "../../../services/admin/bookService";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";

// const ADMIN = process.env.REACT_APP_ADMIN;

// const ProductsPage = () => {
//   const [books, setBooks] = useState([]);
//   const [displayBooks, setDisplayBooks] = useState([]);
//   const [selectedBooks, setSelectedBooks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [multiLoading, setMultiLoading] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState("success");
//   const { hasPermission } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const limitItems = 10;

//   const [filters, setFilters] = useState({
//     rating: "",
//     sortBy: "",
//     sortOrder: "",
//     keyword: "",
//   });

//   const fetchBooks = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const response = await getBooks({ keyword: filters.keyword });
//       if (response.code === 200) {
//         let filteredBooks = response.books;

//         // Tính priceNew
//         filteredBooks = filteredBooks.map((book) => ({
//           ...book,
//           priceNew: book.discountPercentage
//             ? Math.round(book.price * (1 - book.discountPercentage / 100))
//             : book.price,
//         }));

//         // Lọc theo rating (giống FeaturedBooksPage)
//         if (filters.rating) {
//           const ratingNum = parseInt(filters.rating);
//           if (!isNaN(ratingNum)) {
//             if (ratingNum === 5) {
//               filteredBooks = filteredBooks.filter(
//                 (book) => book.rating_mean === 5
//               );
//             } else if (ratingNum >= 1 && ratingNum <= 4) {
//               filteredBooks = filteredBooks.filter(
//                 (book) =>
//                   book.rating_mean >= ratingNum &&
//                   book.rating_mean < ratingNum + 1
//               );
//             }
//           }
//         }

//         // Sắp xếp phía client (giống FeaturedBooksPage)
//         if (filters.sortBy && filters.sortOrder) {
//           if (filters.sortBy === "priceNew") {
//             filteredBooks.sort((a, b) => {
//               const valA = a.priceNew || 0;
//               const valB = b.priceNew || 0;
//               return filters.sortOrder === "asc" ? valA - valB : valB - valA;
//             });
//           } else if (filters.sortBy === "soldCount") {
//             filteredBooks.sort((a, b) => {
//               const valA = a.soldCount || 0;
//               const valB = b.soldCount || 0;
//               return filters.sortOrder === "asc" ? valA - valB : valB - valA;
//             });
//           } else if (filters.sortBy === "rating_mean") {
//             filteredBooks.sort((a, b) => {
//               const valA = a.rating_mean || 0;
//               const valB = b.rating_mean || 0;
//               return filters.sortOrder === "asc" ? valA - valB : valB - valA;
//             });
//           }
//         }

//         setBooks(filteredBooks);
//         setTotalItems(filteredBooks.length);
//         setTotalPages(Math.ceil(filteredBooks.length / limitItems));
//         setDisplayBooks(filteredBooks.slice(0, limitItems));
//         setCurrentPage(1);
//       } else {
//         throw new Error(response.message || "Lỗi khi tải danh sách sách");
//       }
//     } catch (error) {
//       setToastMessage(error.message || "Đã xảy ra lỗi khi tải danh sách sách!");
//       setToastVariant("danger");
//       setShowToast(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks(filters);
//   }, [filters]);

//   useEffect(() => {
//     const indexOfLastBook = currentPage * limitItems;
//     const indexOfFirstBook = indexOfLastBook - limitItems;
//     setDisplayBooks(books.slice(indexOfFirstBook, indexOfLastBook));
//   }, [currentPage, books]);

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const handleAddNew = () => {
//     navigate(`/${ADMIN}/book/create`);
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const response = await changeStatus(id, newStatus);
//       if (response.code === 200) {
//         setToastMessage("Cập nhật trạng thái thành công!");
//         setToastVariant("success");
//         setShowToast(true);
//         fetchBooks(filters);
//       } else {
//         throw new Error(response.message || "Lỗi khi cập nhật trạng thái");
//       }
//     } catch (error) {
//       setToastMessage(
//         error.message || "Đã xảy ra lỗi khi cập nhật trạng thái!"
//       );
//       setToastVariant("danger");
//       setShowToast(true);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await deleteBook(id);
//       if (response.code === 200) {
//         setToastMessage("Xóa thành công!");
//         setToastVariant("success");
//         setShowToast(true);
//         fetchBooks(filters);
//       } else {
//         throw new Error(response.message || "Lỗi khi xóa sản phẩm");
//       }
//     } catch (error) {
//       setToastMessage(error.message || "Đã xảy ra lỗi khi xóa sản phẩm!");
//       setToastVariant("danger");
//       setShowToast(true);
//     }
//   };

//   const handleSelectBooks = (newSelectedBooks) => {
//     setSelectedBooks(newSelectedBooks);
//   };

//   const handleChangeMulti = async (key, value) => {
//     if (!selectedBooks || selectedBooks.length === 0) {
//       setToastMessage(
//         "Vui lòng chọn ít nhất một sản phẩm để thực hiện hành động!"
//       );
//       setToastVariant("warning");
//       setShowToast(true);
//       return;
//     }

//     if (
//       window.confirm(
//         `Bạn có chắc chắn muốn ${
//           key === "delete"
//             ? "xóa"
//             : value === "active"
//             ? "kích hoạt"
//             : "dừng hoạt động"
//         } ${selectedBooks.length} sản phẩm đã chọn không?`
//       )
//     ) {
//       try {
//         setMultiLoading(true);
//         const response = await changeMulti(selectedBooks, key, value);
//         if (response.code === 200) {
//           setToastMessage(response.message || "Thay đổi thành công!");
//           setToastVariant("success");
//           setShowToast(true);
//           setSelectedBooks([]);
//           fetchBooks(filters);
//         } else {
//           throw new Error(
//             response.message || "Lỗi khi thay đổi nhiều sản phẩm"
//           );
//         }
//       } catch (error) {
//         setToastMessage(
//           error.message || "Đã xảy ra lỗi khi thay đổi nhiều sản phẩm!"
//         );
//         setToastVariant("danger");
//         setShowToast(true);
//       } finally {
//         setMultiLoading(false);
//       }
//     }
//   };

//   return (
//     <Container fluid className="products-page">
//       <h2 className="mb-4">Danh sách sản phẩm</h2>

//       <div className="mb-3">
//         {hasPermission("create_books") && (
//           <Button variant="primary" onClick={handleAddNew} className="mb-2">
//             Thêm sản phẩm mới
//           </Button>
//         )}
//       </div>

//       <BookFilterSortComponent
//         onFilterChange={handleFilterChange}
//         initialFilters={filters}
//       />

//       {selectedBooks.length > 0 && (
//         <div className="mb-3">
//           {hasPermission("delete_books") && (
//             <Button
//               variant="danger"
//               onClick={() => handleChangeMulti("delete", true)}
//               className="me-2"
//               disabled={multiLoading}
//             >
//               {multiLoading ? (
//                 <Spinner animation="border" size="sm" className="me-2" />
//               ) : null}
//               Xóa các mục đã chọn
//             </Button>
//           )}
//           {hasPermission("update_books") && (
//             <>
//               <Button
//                 variant="warning"
//                 onClick={() => handleChangeMulti("status", "inactive")}
//                 className="me-2"
//                 disabled={multiLoading}
//               >
//                 {multiLoading ? (
//                   <Spinner animation="border" size="sm" className="me-2" />
//                 ) : null}
//                 Dừng hoạt động
//               </Button>
//               <Button
//                 variant="success"
//                 onClick={() => handleChangeMulti("status", "active")}
//                 disabled={multiLoading}
//               >
//                 {multiLoading ? (
//                   <Spinner animation="border" size="sm" className="me-2" />
//                 ) : null}
//                 Kích hoạt
//               </Button>
//             </>
//           )}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center my-4">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <ProductTableComponent
//           books={displayBooks}
//           onStatusChange={handleStatusChange}
//           onDelete={handleDelete}
//           onSelect={handleSelectBooks}
//           selectedBooks={selectedBooks}
//           currentPage={currentPage}
//           limitItems={limitItems}
//         />
//       )}

//       {totalPages > 0 && (
//         <PaginationComponent
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalItems={totalItems}
//           loading={loading}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       )}

//       <ToastContainer position="top-end" className="p-3">
//         <Toast
//           show={showToast}
//           onClose={() => setShowToast(false)}
//           delay={3000}
//           autohide
//           bg={toastVariant}
//         >
//           <Toast.Header>
//             <strong className="me-auto">
//               {toastVariant === "success"
//                 ? "Thành công"
//                 : toastVariant === "danger"
//                 ? "Lỗi"
//                 : "Cảnh báo"}
//             </strong>
//           </Toast.Header>
//           <Toast.Body>{toastMessage}</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </Container>
//   );
// };

// export default ProductsPage;

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Button,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import FilterBarComponent from "../../../components/admin/FilterBarComponent";
import BookFilterSortComponent from "../../../components/client/product/BookFilterSortComponent";
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
  const [displayBooks, setDisplayBooks] = useState([]);
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
  const limitItems = 10;

  const [filters, setFilters] = useState({
    status: "",
    keyword: "",
    rating: "",
    sortBy: "",
    sortOrder: "",
  });

  const fetchBooks = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await getBooks({
        status: filters.status,
        keyword: filters.keyword,
      });
      if (response.code === 200) {
        let filteredBooks = response.books;

        // Tính priceNew
        filteredBooks = filteredBooks.map((book) => ({
          ...book,
          priceNew: book.discountPercentage
            ? Math.round(book.price * (1 - book.discountPercentage / 100))
            : book.price,
          rating_mean:
            typeof book.rating_mean === "string"
              ? parseFloat(book.rating_mean)
              : book.rating_mean || 0,
        }));

        // Lọc theo rating
        if (filters.rating) {
          const ratingNum = parseInt(filters.rating);
          if (!isNaN(ratingNum)) {
            if (ratingNum === 5) {
              filteredBooks = filteredBooks.filter(
                (book) => book.rating_mean === 5
              );
            } else if (ratingNum >= 1 && ratingNum <= 4) {
              filteredBooks = filteredBooks.filter(
                (book) =>
                  book.rating_mean >= ratingNum &&
                  book.rating_mean < ratingNum + 1
              );
            }
          }
        }

        // Sắp xếp phía client
        if (filters.sortBy && filters.sortOrder) {
          if (filters.sortBy === "priceNew") {
            filteredBooks.sort((a, b) => {
              const valA = a.priceNew || 0;
              const valB = b.priceNew || 0;
              return filters.sortOrder === "asc" ? valA - valB : valB - valA;
            });
          } else if (filters.sortBy === "soldCount") {
            filteredBooks.sort((a, b) => {
              const valA = a.soldCount || 0;
              const valB = b.soldCount || 0;
              return filters.sortOrder === "asc" ? valA - valB : valB - valA;
            });
          } else if (filters.sortBy === "rating_mean") {
            filteredBooks.sort((a, b) => {
              const valA = a.rating_mean || 0;
              const valB = b.rating_mean || 0;
              return filters.sortOrder === "asc" ? valA - valB : valB - valA;
            });
          }
        }

        setBooks(filteredBooks);
        setTotalItems(filteredBooks.length);
        setTotalPages(Math.ceil(filteredBooks.length / limitItems));
        setDisplayBooks(filteredBooks.slice(0, limitItems));
        setCurrentPage(1);
      } else {
        throw new Error(response.message || "Lỗi khi tải danh sách sách");
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
    fetchBooks(filters);
  }, [filters]);

  useEffect(() => {
    const indexOfLastBook = currentPage * limitItems;
    const indexOfFirstBook = indexOfLastBook - limitItems;
    setDisplayBooks(books.slice(indexOfFirstBook, indexOfLastBook));
  }, [currentPage, books]);

  const handleFilter = (newFilter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: newFilter.status || "",
    }));
  };

  const handleSearch = (keyword) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      keyword,
    }));
  };

  const handleFilterSortChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      rating: newFilters.rating || "",
      sortBy: newFilters.sortBy || "",
      sortOrder: newFilters.sortOrder || "",
    }));
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
        fetchBooks(filters);
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
        fetchBooks(filters);
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
          fetchBooks(filters);
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
        onAddNew={handleAddNew}
      />

      <BookFilterSortComponent
        onFilterChange={handleFilterSortChange}
        initialFilters={{
          rating: filters.rating,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }}
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
          books={displayBooks}
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success"
                ? "Thành công"
                : toastVariant === "danger"
                ? "Lỗi"
                : "Cảnh báo"}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ProductsPage;
