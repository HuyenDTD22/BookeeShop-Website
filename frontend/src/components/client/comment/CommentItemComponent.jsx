import React, { useState, forwardRef, useRef } from "react";
import { Dropdown, Alert, Image, Spinner } from "react-bootstrap";
import { FaThumbsUp, FaReply, FaEllipsisH, FaTrash } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import CommentFormComponent from "./CommentFormComponent";
import commentService from "../../../services/client/commentService";

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      cursor: "pointer",
      color: "#999",
      fontSize: "12px",
      fontWeight: "normal",
    }}
  >
    {children}
  </span>
));

const CommentItemComponent = ({
  comment,
  bookId,
  onCommentAdded,
  onCommentDeleted,
  parentComment = null,
  isChild = false,
}) => {
  const [replyForms, setReplyForms] = useState({});
  const [error, setError] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now - created;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return "vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 30) return `${diffDays} ngày`;
    if (diffDays < 365) return `${diffMonths} tháng`;
    return `${diffYears} năm`;
  };

  const handleDelete = (currentComment) => async () => {
    setIsDeleting((prev) => ({ ...prev, [currentComment._id]: true }));
    try {
      const response = await commentService.deleteComment(
        currentComment._id,
        bookId
      );
      if (response.code === 200) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        onCommentDeleted(
          currentComment._id,
          currentComment.parent_id || null,
          !!currentComment.parent_id
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi xóa bình luận!"
      );
    } finally {
      setIsDeleting((prev) => ({ ...prev, [currentComment._id]: false }));
    }
  };

  const handleReactionSelect = (emoji) => {
    setShowReactionPicker(false);
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleCloseReplyForm = (commentId) => {
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const handleCommentAdded = (newComment) => {
    onCommentAdded(newComment);
    if (newComment.parent_id) {
      handleCloseReplyForm(newComment.parent_id); // Đóng form sau khi gửi
    }
  };

  const renderCommentTree = (comments, parent = null, isChildLevel = false) => {
    return comments.map((item) => (
      <div key={item._id}>
        <div
          className="comment-item mb-3"
          style={{
            padding: "10px",
            marginLeft: isChildLevel ? "2rem" : "0",
          }}
        >
          <div className="d-flex align-items-start">
            <Image
              src={item.user_id?.avatar || "https://via.placeholder.com/40"}
              roundedCircle
              style={{ width: "40px", height: "40px", marginRight: "15px" }}
            />
            <div style={{ flex: 1 }}>
              <div className="d-flex align-items-center">
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "inline-block",
                    minWidth: "200px",
                  }}
                >
                  <strong style={{ fontSize: "14px" }}>
                    {item.user_id?.fullName || "Người dùng"}
                  </strong>
                  <p style={{ margin: "5px 0", fontSize: "16px" }}>
                    {item.parent_id && parent ? (
                      <>
                        <strong>
                          {parent.user_id?.fullName || "Người dùng"}
                        </strong>{" "}
                        {item.content}
                      </>
                    ) : (
                      item.content
                    )}
                  </p>
                </div>
                <Dropdown className="ms-2" align="end">
                  <Dropdown.Toggle as={CustomToggle}>
                    <FaEllipsisH />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={handleDelete(item)}
                      disabled={isDeleting[item._id] || false}
                    >
                      {isDeleting[item._id] ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <FaTrash className="me-2" /> Xóa bình luận
                        </>
                      )}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {item.thumbnail && (
                <div style={{ marginTop: "10px" }}>
                  <Image
                    src={item.thumbnail}
                    alt="Thumbnail"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
              <div
                className="d-flex align-items-center mt-2"
                style={{ fontSize: "12px", color: "#666" }}
              >
                <span>{formatTimeAgo(item.createdAt)}</span>
                <div className="ms-3 d-flex align-items-center">
                  <span
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    onMouseEnter={() => setShowReactionPicker(true)}
                    onMouseLeave={() => setShowReactionPicker(false)}
                  >
                    <FaThumbsUp /> Thích
                  </span>
                  {showReactionPicker && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "20px",
                        zIndex: 1000,
                      }}
                    >
                      <Picker
                        data={data}
                        onEmojiSelect={handleReactionSelect}
                      />
                    </div>
                  )}
                  <span
                    className="ms-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleReplyForm(item._id)}
                  >
                    <FaReply /> Trả lời
                  </span>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
          {replyForms[item._id] && (
            <div className="mt-3">
              <CommentFormComponent
                key={item._id}
                bookId={bookId}
                parentCommentId={item._id}
                onCommentAdded={handleCommentAdded}
                formKey={item._id}
                onClose={() => handleCloseReplyForm(item._id)} // Truyền hàm đóng form
              />
            </div>
          )}
        </div>
        {item.children && item.children.length > 0 && (
          <div>{renderCommentTree(item.children, item, true)}</div>
        )}
      </div>
    ));
  };

  return <>{renderCommentTree([comment], null, isChild)}</>;
};

export default CommentItemComponent;
