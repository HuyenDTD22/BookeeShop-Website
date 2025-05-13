import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import authService from "../../../services/client/authService";
import UploadImageComponent from "../../common/UploadImageComponent";

const SettingsFormComponent = ({ user, setUserInfo }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    gender: user?.gender || "other",
    email: user?.email || "",
    address: user?.address || "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
    avatar: user?.avatar || "",
  });
  const [imagePreview, setImagePreview] = useState(user?.avatar || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        gender: user.gender || "other",
        email: user.email || "",
        address: user?.address || "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        avatar: user.avatar || "",
      });
      setImagePreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, avatar: file || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);
      data.append("gender", formData.gender);
      data.append("email", formData.email);
      data.append("address", formData.address);
      if (formData.oldPassword)
        data.append("oldPassword", formData.oldPassword);
      if (formData.password) data.append("password", formData.password);
      if (formData.confirmPassword)
        data.append("confirmPassword", formData.confirmPassword);
      if (formData.avatar && formData.avatar instanceof File) {
        data.append("avatar", formData.avatar);
      }

      const response = await authService.updateUserInfo(data);
      setUserInfo(response.info);
      setSuccess("Cập nhật thông tin thành công!");
    } catch (error) {
      setError(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <Card.Body className="bg-light">
      <Form onSubmit={handleSubmit}>
        <UploadImageComponent
          onFileChange={handleImageChange}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          fieldName="avatar"
          label="Ảnh đại diện"
        />
        <Form.Group className="mb-3">
          <Form.Label>Họ và tên</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giới tính</Form.Label>
          <Form.Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Địa chỉ</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu cũ</Form.Label>
          <Form.Control
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu cũ"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Xác nhận mật khẩu</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Lưu thay đổi
          </Button>
        </div>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mt-3">
            {success}
          </Alert>
        )}
      </Form>
    </Card.Body>
  );
};

export default SettingsFormComponent;
