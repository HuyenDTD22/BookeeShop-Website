import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import quillConfig from "../../../utils/quillConfig";
import notificationService from "../../../services/admin/notificationService";

const NotificationFormComponent = ({ notification, isEdit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "system",
    target: { type: "all", groupId: null, userIds: [] },
    sendAt: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && notification) {
      setFormData({
        title: notification.title || "",
        content: notification.content || "",
        type: notification.type || "system",
        target: notification.target || {
          type: "all",
          groupId: null,
          userIds: [],
        },
        sendAt: notification.sendAt
          ? new Date(notification.sendAt).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [notification, isEdit]);

  const handleQuillChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("target.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        target: { ...prev.target, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await notificationService.updateNotification(
          notification._id,
          formData
        );
        alert("Cập nhật thông báo thành công!");
      } else {
        await notificationService.createNotification(formData);
        alert("Tạo thông báo thành công!");
      }
      navigate(`/${process.env.REACT_APP_ADMIN}/notification`);
    } catch (error) {
      alert(
        isEdit ? "Cập nhật thông báo thất bại!" : "Tạo thông báo thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Tiêu đề</Form.Label>
        <ReactQuill
          value={formData.title}
          onChange={handleQuillChange("title")}
          modules={quillConfig.modules}
          formats={quillConfig.formats}
          placeholder="Nhập tiêu đề thông báo"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nội dung</Form.Label>
        <ReactQuill
          value={formData.content}
          onChange={handleQuillChange("content")}
          modules={quillConfig.modules}
          formats={quillConfig.formats}
          placeholder="Nhập nội dung thông báo"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Loại thông báo</Form.Label>
        <Form.Select name="type" value={formData.type} onChange={handleChange}>
          <option value="system">Hệ thống</option>
          <option value="promotion">Khuyến mãi</option>
          <option value="personal">Cá nhân</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Đối tượng</Form.Label>
        <Form.Select
          name="target.type"
          value={formData.target.type}
          onChange={handleChange}
        >
          <option value="all">Tất cả</option>
          <option value="group">Nhóm</option>
          <option value="specific">Cụ thể</option>
        </Form.Select>
      </Form.Group>

      {formData.target.type === "group" && (
        <Form.Group className="mb-3">
          <Form.Label>ID nhóm</Form.Label>
          <Form.Control
            type="text"
            name="target.groupId"
            value={formData.target.groupId || ""}
            onChange={handleChange}
            placeholder="Nhập ID nhóm (ví dụ: vip, new_user)"
          />
        </Form.Group>
      )}

      {formData.target.type === "specific" && (
        <Form.Group className="mb-3">
          <Form.Label>Danh sách ID người dùng</Form.Label>
          <Form.Control
            type="text"
            name="target.userIds"
            value={formData.target.userIds.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                target: {
                  ...prev.target,
                  userIds: e.target.value
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id),
                },
              }))
            }
            placeholder="Nhập danh sách ID, cách nhau bằng dấu phẩy"
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Thời gian gửi (tùy chọn)</Form.Label>
        <Form.Control
          type="datetime-local"
          name="sendAt"
          value={formData.sendAt}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : isEdit ? (
          "Cập nhật"
        ) : (
          "Tạo"
        )}
      </Button>
    </Form>
  );
};

export default NotificationFormComponent;
