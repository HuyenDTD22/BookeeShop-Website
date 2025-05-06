// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Alert,
//   Spinner,
//   Card,
// } from "react-bootstrap";
// import bookService from "../../../services/client/bookService";
// import cartService from "../../../services/client/cartService"; // Thêm import cartService
// import commentService from "../../../services/client/commentService";
// import ratingService from "../../../services/client/ratingService";
// import StarRatingComponent from "../../../components/common/StarRatingComponent";
// import CommentFormComponent from "../../../components/client/comment/CommentFormComponent";
// import CommentItemComponent from "../../../components/client/comment/CommentItemComponent";
// import BookCardComponent from "../../../components/client/product/BookCardComponent";
// import "../../../styles/client/pages/BookDetailPage.css";

// const BookDetailPage = () => {
//   const { slugBook } = useParams();
//   const navigate = useNavigate();
//   const [book, setBook] = useState(null);
//   const [relatedBooks, setRelatedBooks] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [totalComments, setTotalComments] = useState(0);
//   const [ratings, setRatings] = useState([]);
//   const [ratingPercentages, setRatingPercentages] = useState({
//     5: 0,
//     4: 0,
//     3: 0,
//     2: 0,
//     1: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [cartError, setCartError] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

//   useEffect(() => {
//     const fetchBookData = async () => {
//       try {
//         // Lấy thông tin sách
//         const bookData = await bookService.getBookDetail(slugBook);
//         setBook(bookData.book);

//         // Lấy sách liên quan
//         if (bookData.book.category.slug) {
//           const related = await bookService.getCategoryBooks(
//             bookData.book.category.slug
//           );
//           setRelatedBooks(related || []);
//         }

//         // Lấy bình luận
//         const commentData = await commentService.getComments(bookData.book._id);
//         setComments(commentData.comments || []);
//         setTotalComments(commentData.total || 0);

//         // [CHANGED] Lấy danh sách đánh giá
//         const ratingData = await ratingService.getRatings(bookData.book._id);
//         setRatings(ratingData.ratings || []);

//         // [CHANGED] Tính toán tỷ lệ phần trăm cho từng mức sao
//         const totalRatings = ratingData.totalRatings || 0;
//         if (totalRatings > 0) {
//           const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//           ratingData.ratings.forEach((rating) => {
//             counts[rating.rating]++;
//           });
//           setRatingPercentages({
//             5: (counts[5] / totalRatings) * 100,
//             4: (counts[4] / totalRatings) * 100,
//             3: (counts[3] / totalRatings) * 100,
//             2: (counts[2] / totalRatings) * 100,
//             1: (counts[1] / totalRatings) * 100,
//           });
//         }
//       } catch (error) {
//         setError(
//           error.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu!"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookData();
//   }, [slugBook]);

//   const handleAddToCart = async () => {
//     try {
//       // Gọi API để thêm vào giỏ hàng
//       const response = await cartService.addToCart(slugBook, 1); // Số lượng mặc định là 1
//       console.log("Gio hang: ", response);
//       if (response.code === 200) {
//         setAddedToCart(true);
//         setCartError("");
//         setTimeout(() => setAddedToCart(false), 2000);
//       }
//     } catch (error) {
//       // Xử lý lỗi từ API
//       const errorMessage =
//         error.response?.data?.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng!";
//       setCartError(errorMessage);
//       // Nếu backend trả về lỗi 401 (chưa đăng nhập), chuyển hướng đến trang đăng nhập
//       //   if (error.response?.status === 401) {
//       //     navigate("/user/login", {
//       //       state: { from: `/book/detail/${slugBook}` },
//       //     });
//       //   }
//     }
//   };

//   // [CHANGED] Hàm xử lý nút "Mua ngay"
//   const handleBuyNow = async () => {
//     navigate("/order", { state: { slug: slugBook, quantity: 1 } });
//   };

//   const handleCommentAdded = (newComment) => {
//     if (newComment.parentCommentId) {
//       setComments((prevComments) =>
//         prevComments.map((comment) =>
//           comment._id === newComment.parentCommentId
//             ? { ...comment, replies: [...(comment.replies || []), newComment] }
//             : comment
//         )
//       );
//     } else {
//       setComments((prevComments) => [newComment, ...prevComments]);
//       setTotalComments((prev) => prev + 1);
//     }
//   };

//   const handleCommentDeleted = (commentId) => {
//     setComments((prevComments) =>
//       prevComments.filter((comment) => comment._id !== commentId)
//     );
//     setTotalComments((prev) => prev - 1);
//   };

//   if (loading) {
//     return (
//       <Container className="text-center my-5">
//         <Spinner animation="border" variant="primary" />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="my-5">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="book-detail-page my-5">
//       <Row className="align-items-start">
//         <Col md={5}>
//           <div className="position-relative" style={{ marginTop: 0 }}>
//             {/* [CHANGED] Bọc ảnh và 2 nút trong một Card riêng */}
//             <Card className="shadow-sm bg-light mb-4">
//               <Card.Body>
//                 <img
//                   src={book.thumbnail}
//                   alt={book.title}
//                   className="img-fluid rounded shadow mb-3"
//                   style={{ maxHeight: "400px", objectFit: "cover" }}
//                 />
//                 <div className="cart-section">
//                   <div className="d-flex mb-3">
//                     <Button
//                       variant="success"
//                       size="lg"
//                       onClick={handleAddToCart}
//                       className="me-2 w-50"
//                     >
//                       Thêm vào giỏ hàng
//                     </Button>
//                     <Button
//                       variant="danger"
//                       size="lg"
//                       onClick={handleBuyNow}
//                       className="w-50"
//                     >
//                       Mua ngay
//                     </Button>
//                   </div>
//                   {addedToCart && (
//                     <Alert variant="success" className="mb-3">
//                       Đã thêm vào giỏ hàng!
//                     </Alert>
//                   )}
//                   {cartError && (
//                     <Alert variant="danger" className="mb-3">
//                       {cartError}
//                     </Alert>
//                   )}
//                 </div>
//               </Card.Body>
//             </Card>
//             {/* [CHANGED] Giữ ô đánh giá sao trong một Card riêng */}
//             <Card className="shadow-sm bg-light">
//               <Card.Body style={{ padding: "1.5rem" }}>
//                 <h5>Đánh giá sản phẩm</h5>
//                 <div className="d-flex align-items-center mb-2">
//                   <h3 className="me-2 mb-0">{book.rating_mean || 0}/5</h3>
//                   <StarRatingComponent rating={book.rating_mean || 0} />
//                   <span className="text-muted ms-2">
//                     ({ratings.length} đánh giá){" "}
//                     {/* [CHANGED] Sử dụng ratings.length */}
//                   </span>
//                 </div>
//                 <div className="rating-bars">
//                   {/* [CHANGED] Cập nhật tỷ lệ phần trăm cho từng mức sao */}
//                   <div className="d-flex align-items-center mb-1">
//                     <span className="me-2">5 sao</span>
//                     <div className="progress w-50">
//                       <div
//                         className="progress-bar bg-success"
//                         role="progressbar"
//                         style={{ width: `${ratingPercentages[5]}%` }}
//                         aria-valuenow={ratingPercentages[5]}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                     <span className="ms-2">
//                       {Math.round(ratingPercentages[5])}%
//                     </span>
//                   </div>
//                   <div className="d-flex align-items-center mb-1">
//                     <span className="me-2">4 sao</span>
//                     <div className="progress w-50">
//                       <div
//                         className="progress-bar bg-success"
//                         role="progressbar"
//                         style={{ width: `${ratingPercentages[4]}%` }}
//                         aria-valuenow={ratingPercentages[4]}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                     <span className="ms-2">
//                       {Math.round(ratingPercentages[4])}%
//                     </span>
//                   </div>
//                   <div className="d-flex align-items-center mb-1">
//                     <span className="me-2">3 sao</span>
//                     <div className="progress w-50">
//                       <div
//                         className="progress-bar bg-warning"
//                         role="progressbar"
//                         style={{ width: `${ratingPercentages[3]}%` }}
//                         aria-valuenow={ratingPercentages[3]}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                     <span className="ms-2">
//                       {Math.round(ratingPercentages[3])}%
//                     </span>
//                   </div>
//                   <div className="d-flex align-items-center mb-1">
//                     <span className="me-2">2 sao</span>
//                     <div className="progress w-50">
//                       <div
//                         className="progress-bar bg-warning"
//                         role="progressbar"
//                         style={{ width: `${ratingPercentages[2]}%` }}
//                         aria-valuenow={ratingPercentages[2]}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                     <span className="ms-2">
//                       {Math.round(ratingPercentages[2])}%
//                     </span>
//                   </div>
//                   <div className="d-flex align-items-center">
//                     <span className="me-2">1 sao</span>
//                     <div className="progress w-50">
//                       <div
//                         className="progress-bar bg-danger"
//                         role="progressbar"
//                         style={{ width: `${ratingPercentages[1]}%` }}
//                         aria-valuenow={ratingPercentages[1]}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                       ></div>
//                     </div>
//                     <span className="ms-2">
//                       {Math.round(ratingPercentages[1])}%
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-muted mt-3">
//                   Chỉ có thành viên mới có thể viết nhận xét. Vui lòng{" "}
//                   <Link to="/user/login" className="text-primary">
//                     đăng nhập
//                   </Link>{" "}
//                   hoặc{" "}
//                   <Link to="/user/register" className="text-primary">
//                     đăng ký
//                   </Link>
//                   .
//                 </p>
//               </Card.Body>
//             </Card>
//           </div>
//         </Col>
//         <Col md={7}>
//           <div style={{ overflowX: "hidden" }}>
//             <Row>
//               {/* Ô 1: Thông tin cơ bản */}
//               <Col md={12} className="mb-4">
//                 <Card className="shadow-sm bg-light">
//                   <Card.Body>
//                     <h1 className="mb-2">{book.title || "Không có tiêu đề"}</h1>
//                     <p className="text-muted mb-2">
//                       Thể loại:{" "}
//                       {book.category && book.category.title
//                         ? book.category.title
//                         : "Không có danh mục"}
//                     </p>
//                     <p className="mb-2">
//                       Tác giả: {book.author || "Không có thông tin"}
//                     </p>
//                     <div className="mb-2">
//                       <StarRatingComponent rating={book.rating_mean || 0} />
//                     </div>
//                     <h4 className="text-danger mb-2">
//                       {(book.priceNew || 0).toLocaleString("vi-VN")} VNĐ{" "}
//                       <small className="text-muted text-decoration-line-through">
//                         {(book.price || 0).toLocaleString("vi-VN")} VNĐ
//                       </small>
//                     </h4>
//                     <p className="mb-0">
//                       Số lượng đã bán:{" "}
//                       {book.stock ? book.stock : "Chưa có số liệu"}
//                     </p>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Ô 2: Thông tin chi tiết */}
//               <Col md={12} className="mb-4">
//                 <Card className="shadow-sm bg-light">
//                   <Card.Body>
//                     <h5 className="mb-3">Thông tin chi tiết</h5>
//                     <p>Tác giả: {book.author || "Không có thông tin"}</p>
//                     <p>Nhà cung cấp: {book.supplier || "Không có thông tin"}</p>
//                     <p>
//                       Nhà xuất bản: {book.publisher || "Không có thông tin"}
//                     </p>
//                     <p>
//                       Năm xuất bản: {book.publish_year || "Không có thông tin"}
//                     </p>
//                     <p>Ngôn ngữ: {book.language || "Không có thông tin"}</p>
//                     <p>Kích thước: {book.size || "Không có thông tin"}</p>
//                     <p>Trọng lượng: {book.weight || "Không có thông tin"}</p>
//                     <p>Số trang: {book.page_count || "Không có thông tin"}</p>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Ô 3: Mô tả sản phẩm */}
//               <Col md={12}>
//                 <Card className="shadow-sm bg-light">
//                   <Card.Body>
//                     <h5 className="mb-3">Mô tả sản phẩm</h5>
//                     <div
//                       style={{
//                         display: isDescriptionExpanded
//                           ? "block"
//                           : "-webkit-box",
//                         WebkitLineClamp: isDescriptionExpanded ? "none" : 3,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       <p
//                         dangerouslySetInnerHTML={{
//                           __html: book.description || "Không có mô tả",
//                         }}
//                       />
//                     </div>
//                   </Card.Body>
//                   {book.description && book.description.length > 100 && (
//                     <Card.Footer style={{ textAlign: "center" }}>
//                       <Button
//                         variant="link"
//                         onClick={() =>
//                           setIsDescriptionExpanded(!isDescriptionExpanded)
//                         }
//                         className="p-0"
//                       >
//                         {isDescriptionExpanded ? "Ẩn bớt" : "Xem thêm"}
//                       </Button>
//                     </Card.Footer>
//                   )}
//                 </Card>
//               </Col>
//             </Row>
//           </div>
//         </Col>
//       </Row>

//       {/* Bình luận */}
//       <section className="comments-section mt-5">
//         <h5>Bình luận ({totalComments})</h5>
//         <CommentFormComponent
//           bookId={book._id}
//           onCommentAdded={handleCommentAdded}
//         />
//         {comments.length > 0 ? (
//           comments.map((comment) => (
//             <CommentItemComponent
//               key={comment._id}
//               comment={comment}
//               bookId={book._id}
//               onCommentAdded={handleCommentAdded}
//               onCommentDeleted={handleCommentDeleted}
//             />
//           ))
//         ) : (
//           <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
//         )}
//       </section>

//       {/* Sách liên quan */}
//       {relatedBooks.length > 0 && (
//         <section className="related-books mt-5">
//           <h5>Sách liên quan</h5>
//           <Row>
//             {relatedBooks.map((relatedBook) => (
//               <Col key={relatedBook._id} md={3} className="mb-4">
//                 <BookCardComponent
//                   book={relatedBook}
//                   link={`/book/detail/${relatedBook.slug}`}
//                 />
//               </Col>
//             ))}
//           </Row>
//         </section>
//       )}
//     </Container>
//   );
// };

// export default BookDetailPage;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import bookService from "../../../services/client/bookService";
import cartService from "../../../services/client/cartService";
import commentService from "../../../services/client/commentService";
import ratingService from "../../../services/client/ratingService";
import StarRatingComponent from "../../../components/common/StarRatingComponent";
import CommentsSectionComponent from "../../../components/client/comment/CommentsSectionComponent"; // Thêm import
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import "../../../styles/client/pages/BookDetailPage.css";

const BookDetailPage = () => {
  const { slugBook } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [ratingPercentages, setRatingPercentages] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookData = await bookService.getBookDetail(slugBook);
        setBook(bookData.book);

        if (bookData.book.category.slug) {
          const related = await bookService.getCategoryBooks(
            bookData.book.category.slug
          );
          setRelatedBooks(related || []);
        }

        const commentData = await commentService.getComments(bookData.book._id);
        setComments(commentData.comments || []);
        setTotalComments(commentData.total || 0);

        const ratingData = await ratingService.getRatings(bookData.book._id);
        setRatings(ratingData.ratings || []);

        const totalRatings = ratingData.totalRatings || 0;
        if (totalRatings > 0) {
          const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          ratingData.ratings.forEach((rating) => {
            counts[rating.rating]++;
          });
          setRatingPercentages({
            5: (counts[5] / totalRatings) * 100,
            4: (counts[4] / totalRatings) * 100,
            3: (counts[3] / totalRatings) * 100,
            2: (counts[2] / totalRatings) * 100,
            1: (counts[1] / totalRatings) * 100,
          });
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [slugBook]);

  const handleAddToCart = async () => {
    try {
      const response = await cartService.addToCart(slugBook, 1);
      console.log("Gio hang: ", response);
      if (response.code === 200) {
        setAddedToCart(true);
        setCartError("");
        setTimeout(() => setAddedToCart(false), 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng!";
      setCartError(errorMessage);
    }
  };

  const handleBuyNow = async () => {
    navigate("/order", { state: { slug: slugBook, quantity: 1 } });
  };

  const handleCommentsUpdated = ({ comments, total }) => {
    setComments(comments);
    setTotalComments(total);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="book-detail-page my-5">
      <Row className="align-items-start">
        <Col md={5}>
          <div className="position-relative" style={{ marginTop: 0 }}>
            <Card className="shadow-sm bg-light mb-4">
              <Card.Body>
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="img-fluid rounded shadow mb-3"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
                <div className="cart-section">
                  <div className="d-flex mb-3">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleAddToCart}
                      className="me-2 w-50"
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={handleBuyNow}
                      className="w-50"
                    >
                      Mua ngay
                    </Button>
                  </div>
                  {addedToCart && (
                    <Alert variant="success" className="mb-3">
                      Đã thêm vào giỏ hàng!
                    </Alert>
                  )}
                  {cartError && (
                    <Alert variant="danger" className="mb-3">
                      {cartError}
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
            <Card className="shadow-sm bg-light">
              <Card.Body style={{ padding: "1.5rem" }}>
                <h5>Đánh giá sản phẩm</h5>
                <div className="d-flex align-items-center mb-2">
                  <h3 className="me-2 mb-0">{book.rating_mean || 0}/5</h3>
                  <StarRatingComponent rating={book.rating_mean || 0} />
                  <span className="text-muted ms-2">
                    ({ratings.length} đánh giá)
                  </span>
                </div>
                <div className="rating-bars">
                  <div className="d-flex align-items-center mb-1">
                    <span className="me-2">5 sao</span>
                    <div className="progress w-50">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${ratingPercentages[5]}%` }}
                        aria-valuenow={ratingPercentages[5]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2">
                      {Math.round(ratingPercentages[5])}%
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="me-2">4 sao</span>
                    <div className="progress w-50">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${ratingPercentages[4]}%` }}
                        aria-valuenow={ratingPercentages[4]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2">
                      {Math.round(ratingPercentages[4])}%
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="me-2">3 sao</span>
                    <div className="progress w-50">
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${ratingPercentages[3]}%` }}
                        aria-valuenow={ratingPercentages[3]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2">
                      {Math.round(ratingPercentages[3])}%
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="me-2">2 sao</span>
                    <div className="progress w-50">
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${ratingPercentages[2]}%` }}
                        aria-valuenow={ratingPercentages[2]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2">
                      {Math.round(ratingPercentages[2])}%
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="me-2">1 sao</span>
                    <div className="progress w-50">
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: `${ratingPercentages[1]}%` }}
                        aria-valuenow={ratingPercentages[1]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2">
                      {Math.round(ratingPercentages[1])}%
                    </span>
                  </div>
                </div>
                <p className="text-muted mt-3">
                  Chỉ có thành viên mới có thể viết nhận xét. Vui lòng{" "}
                  <Link to="/user/login" className="text-primary">
                    đăng nhập
                  </Link>{" "}
                  hoặc{" "}
                  <Link to="/user/register" className="text-primary">
                    đăng ký
                  </Link>
                  .
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col md={7}>
          <div style={{ overflowX: "hidden" }}>
            <Row>
              <Col md={12} className="mb-4">
                <Card className="shadow-sm bg-light">
                  <Card.Body>
                    <h1 className="mb-2">{book.title || "Không có tiêu đề"}</h1>
                    <p className="text-muted mb-2">
                      Thể loại:{" "}
                      {book.category && book.category.title
                        ? book.category.title
                        : "Không có danh mục"}
                    </p>
                    <p className="mb-2">
                      Tác giả: {book.author || "Không có thông tin"}
                    </p>
                    <div className="mb-2">
                      <StarRatingComponent rating={book.rating_mean || 0} />
                    </div>
                    <h4 className="text-danger mb-2">
                      {(book.priceNew || 0).toLocaleString("vi-VN")} VNĐ{" "}
                      <small className="text-muted text-decoration-line-through">
                        {(book.price || 0).toLocaleString("vi-VN")} VNĐ
                      </small>
                    </h4>
                    <p className="mb-0">
                      Số lượng đã bán:{" "}
                      {book.stock ? book.stock : "Chưa có số liệu"}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12} className="mb-4">
                <Card className="shadow-sm bg-light">
                  <Card.Body>
                    <h5 className="mb-3">Thông tin chi tiết</h5>
                    <p>Tác giả: {book.author || "Không có thông tin"}</p>
                    <p>Nhà cung cấp: {book.supplier || "Không có thông tin"}</p>
                    <p>
                      Nhà xuất bản: {book.publisher || "Không có thông tin"}
                    </p>
                    <p>
                      Năm xuất bản: {book.publish_year || "Không có thông tin"}
                    </p>
                    <p>Ngôn ngữ: {book.language || "Không có thông tin"}</p>
                    <p>Kích thước: {book.size || "Không có thông tin"}</p>
                    <p>Trọng lượng: {book.weight || "Không có thông tin"}</p>
                    <p>Số trang: {book.page_count || "Không có thông tin"}</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="shadow-sm bg-light">
                  <Card.Body>
                    <h5 className="mb-3">Mô tả sản phẩm</h5>
                    <div
                      style={{
                        display: isDescriptionExpanded
                          ? "block"
                          : "-webkit-box",
                        WebkitLineClamp: isDescriptionExpanded ? "none" : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: book.description || "Không có mô tả",
                        }}
                      />
                    </div>
                  </Card.Body>
                  {book.description && book.description.length > 100 && (
                    <Card.Footer style={{ textAlign: "center" }}>
                      <Button
                        variant="link"
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="p-0"
                      >
                        {isDescriptionExpanded ? "Ẩn bớt" : "Xem thêm"}
                      </Button>
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <CommentsSectionComponent
        bookId={book._id}
        initialComments={comments}
        initialTotal={totalComments}
        onCommentsUpdated={handleCommentsUpdated}
      />

      {relatedBooks.length > 0 && (
        <section className="related-books mt-5">
          <h5>Sách liên quan</h5>
          <Row>
            {relatedBooks.map((relatedBook) => (
              <Col key={relatedBook._id} md={3} className="mb-4">
                <BookCardComponent
                  book={relatedBook}
                  link={`/book/detail/${relatedBook.slug}`}
                />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default BookDetailPage;
