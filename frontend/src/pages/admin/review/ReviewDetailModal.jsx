import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Form,
  Button,
  ProgressBar,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { FaTrash, FaReply, FaStar } from "react-icons/fa";
import commentService from "../../../services/admin/commentService";
import ratingService from "../../../services/admin/ratingService";
import StarRatingComponent from "../../../components/common/StarRatingComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";

const ReviewDetailModal = ({ show, onHide, book }) => {
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComments, setSelectedComments] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);

  const ratingDistribution = [0, 0, 0, 0, 0];
  ratings.forEach((rating) => {
    if (rating.rating >= 1 && rating.rating <= 5) {
      ratingDistribution[rating.rating - 1]++;
    }
  });
  const totalRatings = ratings.length;
  const ratingPercentages = ratingDistribution.map(
    (count) => (count / totalRatings) * 100 || 0
  );

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const countTotalComments = (comments) => {
    let total = 0;
    const countRecursively = (commentList) => {
      commentList.forEach((comment) => {
        total++;
        if (comment.children && comment.children.length > 0) {
          countRecursively(comment.children);
        }
      });
    };
    countRecursively(comments);
    return total;
  };

  const flattenComments = (comments) => {
    const flatList = [];
    const flattenRecursively = (commentList, level = 0) => {
      commentList.forEach((comment) => {
        flatList.push({ ...comment, level });
        if (comment.children && comment.children.length > 0) {
          flattenRecursively(comment.children, level + 1);
        }
      });
    };
    flattenRecursively(comments);
    return flatList;
  };

  const getPaginatedComments = (comments) => {
    const flatComments = flattenComments(comments);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return flatComments.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ratingResponse = await ratingService.getRatings(book._id);
        setRatings(ratingResponse.data.ratings || []);

        const commentResponse = await commentService.getComments(book._id, {
          search: searchTerm,
          ratingFilter,
        });
        const fetchedComments = commentResponse.data.comments || [];
        setComments(fetchedComments);
        setFilteredComments(fetchedComments);
        setTotalItems(countTotalComments(fetchedComments));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    if (show) {
      fetchData();
    }
  }, [book._id, show, searchTerm, ratingFilter]);

  useEffect(() => {
    let filtered = [...comments];
    if (timeFilter === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (timeFilter === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setFilteredComments(filtered);
  }, [timeFilter, comments]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await commentService.deleteComment(commentId);
        const updatedComments = comments.filter(
          (comment) => comment._id !== commentId
        );
        setComments(updatedComments);
        setFilteredComments(updatedComments);
        setTotalItems(countTotalComments(updatedComments));
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  const handleDeleteMultipleComments = async () => {
    if (selectedComments.length === 0) {
      alert("Vui lòng chọn ít nhất một bình luận để xóa!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa các bình luận đã chọn?")) {
      try {
        await commentService.deleteMultipleComments(selectedComments);
        const updatedComments = comments.filter(
          (comment) => !selectedComments.includes(comment._id)
        );
        setComments(updatedComments);
        setFilteredComments(updatedComments);
        setSelectedComments([]);
        setTotalItems(countTotalComments(updatedComments));
      } catch (error) {
        console.error("Error deleting multiple comments:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  const handleReplyComment = async (commentId) => {
    if (!replyContent) {
      alert("Vui lòng nhập nội dung phản hồi!");
      return;
    }
    try {
      const response = await commentService.replyComment(
        commentId,
        replyContent
      );
      const updatedComments = [...comments];
      setComments(updatedComments);
      setFilteredComments(updatedComments);
      setReplyContent("");
      setReplyingCommentId(null);
      setTotalItems(countTotalComments(updatedComments));
    } catch (error) {
      console.error("Error replying to comment:", error);
      alert("Phản hồi thất bại!");
    }
  };

  const findParentComment = (commentId, rootComments) => {
    for (const comment of rootComments) {
      if (comment._id === commentId) {
        return comment;
      }
      if (comment.children && comment.children.length > 0) {
        const parentComment = findParentComment(commentId, comment.children);
        if (parentComment) return parentComment;
      }
    }
    return null;
  };

  const renderCommentTree = (comments, rootComments) => {
    return comments.map((comment) => {
      const userRating = comment.rating || 0;

      const parentComment = comment.parent_id
        ? findParentComment(comment.parent_id, rootComments)
        : null;

      const displayName = comment.isAdmin
        ? "BookeeShop"
        : comment.user_id?.fullName || "Người dùng không xác định";

      return (
        <tr key={comment._id}>
          <td>
            <Form.Check
              type="checkbox"
              checked={selectedComments.includes(comment._id)}
              onChange={() => handleSelectComment(comment._id)}
            />
          </td>
          <td>{comment.index}</td>
          <td>
            {displayName}
            {!comment.isAdmin && userRating > 0 && (
              <>
                {" "}
                ({userRating} <FaStar color="gold" />)
              </>
            )}
          </td>
          <td>
            <div style={{ paddingLeft: comment.level > 0 ? "20px" : "0px" }}>
              {comment.parent_id && parentComment ? (
                <>
                  <strong>
                    {parentComment.isAdmin
                      ? "BookeeShop"
                      : parentComment.user_id?.fullName ||
                        "Người dùng không xác định"}
                  </strong>{" "}
                  {comment.content}
                </>
              ) : (
                comment.content
              )}
            </div>
          </td>
          <td>{formatDateTime(comment.createdAt)}</td>
          <td>
            <Button
              variant="danger"
              size="sm"
              className="me-2"
              onClick={() => handleDeleteComment(comment._id)}
            >
              <FaTrash />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setReplyingCommentId(comment._id)}
            >
              <FaReply />
            </Button>
          </td>
        </tr>
      );
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const paginatedComments = getPaginatedComments(filteredComments);
      setSelectedComments(paginatedComments.map((comment) => comment._id));
    } else {
      setSelectedComments([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedComments = getPaginatedComments(filteredComments);

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đánh giá - {book.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Đánh giá sao */}
        <h5>Đánh giá sao</h5>
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
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="d-flex align-items-center mb-1">
                  <span className="me-2" style={{ whiteSpace: "nowrap" }}>
                    {star} sao
                  </span>
                  <div className="progress" style={{ width: "300px" }}>
                    <div
                      className={`progress-bar ${
                        star >= 4
                          ? "bg-success"
                          : star === 3
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      role="progressbar"
                      style={{ width: `${ratingPercentages[5 - star]}%` }}
                      aria-valuenow={ratingPercentages[5 - star]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="ms-2">
                    {Math.round(ratingPercentages[5 - star])}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ gap: "5px", margin: "5px 0" }}
        >
          <Button
            variant="danger"
            onClick={handleDeleteMultipleComments}
            disabled={selectedComments.length === 0}
            style={{ margin: 0 }}
          >
            Xóa các bình luận đã chọn
          </Button>
          <Form.Select
            style={{ width: "150px", margin: 0 }}
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Lọc theo sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </Form.Select>
          <Form.Select
            style={{ width: "200px", margin: 0 }}
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Lọc theo thời gian</option>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </Form.Select>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm tên người bình luận..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: "300px", margin: 0 }}
            />
            <Button
              variant="primary"
              onClick={handleSearchSubmit}
              style={{ margin: 0 }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Bảng bình luận */}
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedComments.length > 0 &&
                      selectedComments.length === paginatedComments.length
                    }
                  />
                </th>
                <th>STT</th>
                <th>Người bình luận</th>
                <th>Nội dung</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {renderCommentTree(paginatedComments, filteredComments)}
            </tbody>
          </Table>
        )}

        {/* Form phản hồi */}
        {replyingCommentId && (
          <div className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Phản hồi bình luận</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Nhập nội dung phản hồi..."
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => handleReplyComment(replyingCommentId)}
              className="me-2"
            >
              Gửi phản hồi
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setReplyingCommentId(null);
                setReplyContent("");
              }}
            >
              Hủy
            </Button>
          </div>
        )}

        {/* Phân trang */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewDetailModal;
