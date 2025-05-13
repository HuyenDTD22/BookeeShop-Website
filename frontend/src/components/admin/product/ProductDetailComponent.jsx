import React, { useState, useEffect } from "react";
import { Row, Col, Image, Badge, Card } from "react-bootstrap";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { getCategory } from "../../../services/admin/categoryService";
import sanitizeHtml from "../../../utils/sanitizeHtml";

const ProductDetailComponent = ({ book }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        console.log("Categories response:", data);
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const findCategoryTitle = (categoryId, categoriesList = categories) => {
    if (!Array.isArray(categoriesList)) {
      return "Không có danh mục";
    }

    for (const category of categoriesList) {
      if (category._id === categoryId) {
        return category.title;
      }
      if (category.children && category.children.length > 0) {
        const childResult = findCategoryTitle(categoryId, category.children);
        if (childResult !== "N/A") {
          return childResult;
        }
      }
    }
    return "N/A";
  };

  const discountedPrice = book.price
    ? (book.price * (100 - (book.discountPercentage || 0))) / 100
    : 0;

  const sanitizedDescription = sanitizeHtml(book.description);

  const renderStars = (rating) => {
    const maxStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning me-1" />);
    }

    if (hasHalfStar && stars.length < maxStars) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning me-1" />);
    }

    while (stars.length < maxStars) {
      stars.push(<FaStar key={stars.length + 1} className="text-muted me-1" />);
    }

    return stars;
  };

  return (
    <>
      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <FiInfo className="me-2" size={24} />
            <h2 className="m-0 fs-4">Chi tiết sản phẩm</h2>
          </div>
        </Card.Header>
      </Card>

      <Row className="mb-5">
        <Col md={5} className="mb-4 d-flex justify-content-center">
          <Image
            src={book.thumbnail || "https://via.placeholder.com/400"}
            alt={book.title}
            fluid
            className="border rounded shadow-sm"
            style={{
              maxHeight: "450px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Col>

        <Col md={7}>
          <h1 className="text-primary mb-3">
            {book.title || "Không có tiêu đề"}
          </h1>
          <div className="mb-3 d-flex align-items-center">
            {renderStars(book.rating_mean || 5)}
            <span className="text-muted ms-2">
              ({book.rating_mean ? book.rating_mean.toFixed(1) : "5.0"})
            </span>
          </div>

          <p className="text-muted mb-2">
            <strong>Danh mục:</strong>{" "}
            <span className="fw-semibold">
              {findCategoryTitle(book.book_category_id)}
            </span>
          </p>
          <p className="text-muted mb-2">
            <strong>Tác giả:</strong>{" "}
            <span className="fw-semibold">{book.author || "N/A"}</span>
          </p>

          <div className="mb-3">
            {book.discountPercentage > 0 ? (
              <>
                <h3 className="text-danger d-inline me-3">
                  {discountedPrice.toLocaleString()}đ
                </h3>
                <h4 className="text-muted d-inline text-decoration-line-through">
                  {book.price.toLocaleString()}đ
                </h4>
                <Badge bg="danger" className="ms-3">
                  Giảm {book.discountPercentage}%
                </Badge>
              </>
            ) : (
              <h3 className="text-danger">
                {book.price?.toLocaleString() || 0}đ
              </h3>
            )}
          </div>

          <p className="mb-2">
            <strong>Số lượng:</strong>{" "}
            <span className="fw-semibold">{book.stock || 0}</span>
          </p>

          <p className="mb-2">
            <strong>Vị trí:</strong> <span>{book.position || 0}</span>
          </p>
          <p className="mb-2">
            <strong>Trạng thái:</strong>{" "}
            <Badge bg={book.status === "active" ? "success" : "danger"}>
              {book.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
            </Badge>
          </p>
          <p className="mb-4">
            <strong>Nổi bật:</strong>{" "}
            <Badge bg={book.featured ? "primary" : "secondary"}>
              {book.featured ? "Có" : "Không"}
            </Badge>
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3 className="text-primary mb-3">Thông tin chi tiết</h3>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Nhà cung cấp:</strong>{" "}
                    <span>{book.supplier || "N/A"}</span>
                  </p>
                  <p>
                    <strong>Nhà xuất bản:</strong>{" "}
                    <span>{book.publisher || "N/A"}</span>
                  </p>
                  <p>
                    <strong>Năm xuất bản:</strong>{" "}
                    <span>{book.publish_year || "N/A"}</span>
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Ngôn ngữ:</strong>{" "}
                    <span>{book.language || "N/A"}</span>
                  </p>
                  <p>
                    <strong>Kích thước:</strong>{" "}
                    <span>{book.size || "N/A"}</span>
                  </p>
                  <p>
                    <strong>Trọng lượng:</strong>{" "}
                    <span>{book.weight || "N/A"}</span>
                  </p>
                  <p>
                    <strong>Số trang:</strong>{" "}
                    <span>{book.page_count || "N/A"}</span>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <h3 className="text-primary mb-3">Mô tả chi tiết</h3>
          <Card className="shadow-sm">
            <Card.Body>
              {sanitizedDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  style={{ lineHeight: "1.6" }}
                />
              ) : (
                <p>Không có mô tả chi tiết</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductDetailComponent;
