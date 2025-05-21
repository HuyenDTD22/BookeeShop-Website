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
  Badge,
  Modal,
} from "react-bootstrap";
import { FiTruck, FiRepeat, FiPercent } from "react-icons/fi";
import bookService from "../../../services/client/bookService";
import cartService from "../../../services/client/cartService";
import commentService from "../../../services/client/commentService";
import ratingService from "../../../services/client/ratingService";
import StarRatingComponent from "../../../components/common/StarRatingComponent";
import CommentsSectionComponent from "../../../components/client/comment/CommentsSectionComponent";
import BookCardComponent from "../../../components/client/product/BookCardComponent";
import authService from "../../../services/client/authService";
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookData = await bookService.getBookDetail(slugBook);
        setBook(bookData.book);

        if (bookData.book.category.slug) {
          const related = await bookService.getCategoryBooks(
            bookData.book.category.slug
          );
          setRelatedBooks(related.newBooks || []);
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

  const checkAuthAndProceed = async (action) => {
    const authStatus = await authService.checkAuth();
    if (authStatus.isAuthenticated) {
      if (action === "addToCart") {
        handleAddToCart();
      } else if (action === "buyNow") {
        handleBuyNow();
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await cartService.addToCart(slugBook, 1);
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
      <Row className="align-items-start g-2">
        <Col md={5}>
          <div className="position-relative" style={{ marginTop: 0 }}>
            <Card className="shadow-sm bg-white mb-4">
              <Card.Body style={{ height: "auto" }}>
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="rounded shadow mb-3"
                  style={{
                    height: "515px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
                <div className="cart-section">
                  <div className="d-flex mb-3">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => checkAuthAndProceed("addToCart")}
                      className="me-2 w-50"
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={() => checkAuthAndProceed("buyNow")}
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
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: "1rem",
                      color: "#333",
                      lineHeight: "1.8",
                    }}
                  >
                    <li className="mb-2">
                      <strong style={{ fontSize: "1.25rem" }}>
                        Chính sách ưu đãi của BookeeShop
                      </strong>
                    </li>
                    <li className="mb-2">
                      <FiTruck
                        style={{ marginRight: "8px", color: "#ff0000" }}
                      />
                      <strong>Thời gian giao hàng</strong>: Giao nhanh và uy tín
                    </li>
                    <li className="mb-2">
                      <FiRepeat
                        style={{ marginRight: "8px", color: "#ff0000" }}
                      />
                      <strong>Chính sách đổi trả</strong>: Đổi trả miễn phí toàn
                      quốc
                    </li>
                    <li className="mb-2">
                      <FiPercent
                        style={{ marginRight: "8px", color: "#ff0000" }}
                      />
                      <strong>Chính sách khách sỉ</strong>: Ưu đãi khi mua số
                      lượng lớn
                    </li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col md={7}>
          <div style={{ overflowX: "hidden" }}>
            <Row className="g-2">
              <Col md={12} className="mb-2">
                <Card className="shadow-sm bg-white">
                  <Card.Body>
                    <h1 className="mb-2">{book.title || "Không có tiêu đề"}</h1>
                    <div className="mb-2">
                      <StarRatingComponent rating={book.rating_mean || 0} />
                    </div>
                    <h4 className="text-danger mb-2">
                      {(book.priceNew || 0).toLocaleString("vi-VN")} VNĐ{" "}
                      <small className="text-muted text-decoration-line-through">
                        {(book.price || 0).toLocaleString("vi-VN")} VNĐ
                      </small>
                      <Badge
                        bg="danger"
                        className="ms-2"
                        style={{ fontSize: "0.7rem", padding: "0.25em 0.4em" }}
                      >
                        -{book.discountPercentage}%
                      </Badge>
                    </h4>
                    <p className="mb-2">
                      Thể loại:{" "}
                      {book.category && book.category.title
                        ? book.category.title
                        : "Không có danh mục"}
                    </p>
                    <p className="mb-2">
                      Tác giả: {book.author || "Không có thông tin"}
                    </p>
                    <p className="mb-0">
                      Đã bán: {book.soldCount ? book.soldCount : 0}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12} className="mb-2">
                <Card className="shadow-sm bg-white">
                  <Card.Body>
                    <h5 className="mb-4">Thông tin chi tiết</h5>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Tác Giả</div>
                        <div className="col-8">
                          {book.author || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Tên Nhà Cung Cấp</div>
                        <div className="col-8">
                          {book.supplier || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Nhà Xuất Bản</div>
                        <div className="col-8">
                          {book.publisher || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Năm Xuất Bản</div>
                        <div className="col-8">
                          {book.publish_year || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Ngôn Ngữ</div>
                        <div className="col-8">
                          {book.language || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">
                          Kích thước Bao Bì
                        </div>
                        <div className="col-8">
                          {book.size || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Trọng lượng (gr)</div>
                        <div className="col-8">
                          {book.weight || "Không có thông tin"}
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #e0e0e0" }} />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        <div className="col-4 text-muted">Số Trang</div>
                        <div className="col-8">
                          {book.page_count || "Không có thông tin"}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row className="g-2">
        <Col md={12}>
          <Card className="shadow-sm bg-white">
            <Card.Body>
              <h5 className="mb-3">Mô tả sản phẩm</h5>
              <div
                style={{
                  display: isDescriptionExpanded ? "block" : "-webkit-box",
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

      <Card className="shadow-sm bg-white mt-3">
        <Card.Body>
          <h5 className="mb-3">Đánh giá sản phẩm</h5>
          <div className="d-flex align-items-center mb-3">
            <div style={{ flex: 1, marginLeft: "2rem" }}>
              <div className="d-flex align-items-center mb-2">
                <h3 className="me-2 mb-0">{book.rating_mean || 0}/5</h3>
                <StarRatingComponent rating={book.rating_mean || 0} />
                <span className="text-muted ms-2">
                  ({ratings.length} đánh giá)
                </span>
              </div>
              <div className="rating-bars">
                <div className="d-flex align-items-center mb-1">
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    5 sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
                    <div
                      className="progress-bar bg-warning"
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
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    4 sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
                    <div
                      className="progress-bar bg-warning"
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
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    3 sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
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
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    2 sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
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
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    1 sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
                    <div
                      className="progress-bar bg-warning"
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
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p className="text-muted ms-3 mb-0">
                Chỉ có thành viên mới có thể đánh giá. Vui lòng{" "}
                <Link to="/user/login" className="text-primary">
                  đăng nhập
                </Link>{" "}
                hoặc{" "}
                <Link to="/user/register" className="text-primary">
                  đăng ký
                </Link>
                .
              </p>
            </div>
          </div>
          <CommentsSectionComponent
            bookId={book._id}
            initialComments={comments}
            initialTotal={totalComments}
            onCommentsUpdated={handleCommentsUpdated}
          />
        </Card.Body>
      </Card>

      {relatedBooks.length > 0 && (
        <Card className="shadow-sm bg-white mt-3">
          <Card.Body>
            <h5 className="mb-3">Gợi ý cho bạn</h5>
            <Row className="g-2">
              {relatedBooks.map((relatedBook) => (
                <Col key={relatedBook._id} md={3} className="mb-2">
                  <BookCardComponent
                    book={relatedBook}
                    link={`/book/detail/${relatedBook.slug}`}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn cần đăng nhập hoặc đăng ký tài khoản để mua sắm!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/user/login")}>
            Đăng nhập
          </Button>
          <Button variant="primary" onClick={() => navigate("/user/register")}>
            Đăng ký
          </Button>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookDetailPage;
