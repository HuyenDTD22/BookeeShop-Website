import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import CommentFormComponent from "./CommentFormComponent";
import commentService from "../../../services/client/commentService";

const CommentItemComponent = ({
  comment,
  bookId,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await commentService.deleteComment(comment._id, bookId);
      onCommentDeleted(comment._id);
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi xóa bình luận!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <div>
              <strong>{comment.user_id?.name || "Ẩn danh"}</strong>
              <small className="text-muted ms-2">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
            {comment.canDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </Button>
            )}
          </div>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
          <Card.Text className="mt-2">{comment.content}</Card.Text>
          <Button
            variant="link"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? "Ẩn trả lời" : "Trả lời"}
          </Button>
          {showReplyForm && (
            <CommentFormComponent
              bookId={bookId}
              parentCommentId={comment._id}
              onCommentAdded={onCommentAdded}
            />
          )}
        </Card.Body>
      </Card>
      {comment.replies?.length > 0 && (
        <div className="ms-4 mt-2">
          {comment.replies.map((reply) => (
            <CommentItemComponent
              key={reply._id}
              comment={reply}
              bookId={bookId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItemComponent;
