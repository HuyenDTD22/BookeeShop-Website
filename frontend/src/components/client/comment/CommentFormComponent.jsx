import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import commentService from "../../../services/client/commentService";

const CommentFormComponent = ({
  bookId,
  parentCommentId = null,
  onCommentAdded,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/user/login", { state: { from: window.location.pathname } });
      return;
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const commentData = {
        book_id: bookId,
        content: content.trim(),
        parentCommentId: parentCommentId,
      };
      const response = await commentService.createComment(commentData);
      onCommentAdded(response.comment);
      setContent("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi bình luận!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {!isAuthenticated && (
        <Alert variant="warning">
          Vui lòng <Link to="/user/login">đăng nhập</Link> để bình luận!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentContent">
          <Form.Label>
            {parentCommentId ? "Trả lời bình luận" : "Viết bình luận của bạn"}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nhập nội dung bình luận..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading || !isAuthenticated}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="mt-2"
          disabled={loading || !isAuthenticated}
        >
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </Button>
      </Form>
    </div>
  );
};

export default CommentFormComponent;
