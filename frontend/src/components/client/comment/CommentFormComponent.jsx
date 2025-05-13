import React, { useState, useEffect, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import {
  FaSmile,
  FaImage,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import commentService from "../../../services/client/commentService";

const CommentFormComponent = ({
  bookId,
  onCommentAdded,
  parentCommentId,
  formKey,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const fileInputId = parentCommentId
    ? `thumbnail-input-${parentCommentId}`
    : "thumbnail-input-root";

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideForm = (event) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        !content.trim() &&
        !thumbnail
      ) {
        const formElement = formRef.current
          .closest(".comment-item")
          ?.querySelector(".mt-3");
        if (formElement) {
          formElement.style.display = "none";
          setContent("");
          setThumbnail(null);
          setThumbnailPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = null;
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutsideForm);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideForm);
  }, [content, thumbnail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !thumbnail) {
      setError("Vui lòng nhập nội dung hoặc chọn ảnh để bình luận!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("book_id", bookId);
      formData.append("content", content.trim());
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (parentCommentId) formData.append("parent_id", parentCommentId);

      const response = await commentService.createComment(formData);
      if (response.code === 200) {
        setSuccess("Bình luận thành công!");
        setError("");
        setContent("");
        setThumbnail(null);
        setThumbnailPreview(null);
        setShowEmojiPicker(false);
        onCommentAdded(response.comment);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        if (parentCommentId && onClose) {
          onClose();
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi bình luận!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleEmojiSelect = (emoji) => {
    setContent((prevContent) => prevContent + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3" ref={formRef}>
      <div style={{ position: "relative" }}>
        <Form.Control
          as="textarea"
          placeholder="Viết bình luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={() => setError("")}
          style={{
            borderRadius: "20px",
            padding: `10px 10px ${thumbnailPreview ? "100px" : "30px"} 10px`,
            minHeight: thumbnailPreview ? "100px" : "40px",
            resize: "none",
          }}
        />
        {thumbnailPreview && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <button
                onClick={handleRemoveThumbnail}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "none",
                  border: "none",
                  color: "#ff0000",
                  cursor: "pointer",
                  zIndex: 1001,
                }}
              >
                <FaTimes size={15} />
              </button>
              <img
                src={thumbnailPreview}
                alt="Preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            width: "calc(100% - 20px)",
            left: "10px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative" }}>
              <FaSmile
                size={20}
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "20px",
                    right: "auto",
                    zIndex: 1000,
                  }}
                >
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
            <label htmlFor={fileInputId} style={{ cursor: "pointer" }}>
              <FaImage size={20} className="text-muted" />
            </label>
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleThumbnailChange}
              style={{ display: "none" }}
            />
          </div>
          <div>
            <button
              type="submit"
              style={{
                background: "none",
                border: "none",
                color: "#0084ff",
                cursor: "pointer",
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? "none" : "auto",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner size={20} className="spin" />
              ) : (
                <FaPaperPlane size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-2">
          {success}
        </Alert>
      )}
    </Form>
  );
};

export default CommentFormComponent;
