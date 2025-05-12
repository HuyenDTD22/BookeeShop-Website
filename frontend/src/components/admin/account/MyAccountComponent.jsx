import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FiSave, FiX } from "react-icons/fi";
import UploadImageComponent from "../../common/UploadImageComponent";

const MyAccountComponent = ({ userInfo, onSubmit, onFileChange }) => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái loading
  const [formData, setFormData] = useState({
    avatar: null,
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birth: "",
    address: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo && typeof userInfo === "object") {
      const birthDate = userInfo.birth
        ? new Date(userInfo.birth).toISOString().split("T")[0]
        : "";
      setFormData({
        fullName: userInfo.fullName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        gender: userInfo.gender || "", // Đảm bảo giá trị ban đầu là "Nam", "Nữ", hoặc rỗng
        birth: birthDate,
        address: userInfo.address || "",
        avatar: null,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setImagePreview(userInfo.avatar || "");
    }
  }, [userInfo]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Xóa lỗi khi người dùng nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true); // Bật trạng thái loading

    // Kiểm tra mật khẩu nếu có nhập
    if (formData.password || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError("Vui lòng nhập mật khẩu cũ!");
        setIsSubmitting(false);
        return;
      }
      if (!formData.password || !formData.confirmPassword) {
        setError("Vui lòng nhập đầy đủ mật khẩu mới và nhập lại mật khẩu!");
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu mới và Nhập lại mật khẩu không khớp!");
        setIsSubmitting(false);
        return;
      }
      if (formData.password.length < 8) {
        setError("Mật khẩu mới phải có ít nhất 8 ký tự!");
        setIsSubmitting(false);
        return;
      }
    }

    // Chuẩn bị FormData
    const formDataToSubmit = new FormData();
    if (selectedFile) {
      formDataToSubmit.append("avatar", selectedFile);
    }
    if (formData.fullName && formData.fullName.trim()) {
      formDataToSubmit.append("fullName", formData.fullName.trim());
    }
    if (formData.phone && formData.phone.trim()) {
      formDataToSubmit.append("phone", formData.phone.trim());
    }
    if (formData.gender) {
      formDataToSubmit.append("gender", formData.gender);
    }
    if (formData.birth) {
      formDataToSubmit.append("birth", formData.birth);
    }
    if (formData.address && formData.address.trim()) {
      formDataToSubmit.append("address", formData.address.trim());
    }
    if (formData.currentPassword) {
      formDataToSubmit.append("currentPassword", formData.currentPassword);
    }
    if (formData.password) {
      formDataToSubmit.append("password", formData.password);
      formDataToSubmit.append("confirmPassword", formData.confirmPassword);
    }

    try {
      await onSubmit(formDataToSubmit);
    } catch (error) {
      setError("Có lỗi xảy ra khi cập nhật tài khoản!");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái loading
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <h2 className="m-0 fs-4">Thông tin tài khoản của tôi</h2>
        </div>
      </Card.Header>
      <Card.Body className="bg-light">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Thông tin cơ bản
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="shadow-sm"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control
                      type="date"
                      name="birth"
                      value={formData.birth}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu cũ</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu cũ (nếu muốn thay đổi mật khẩu)"
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)"
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="shadow-sm"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Ảnh đại diện
                  </h5>
                  <UploadImageComponent
                    onFileChange={handleFileChange}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    fieldName="avatar"
                    label="Ảnh đại diện"
                  />
                </Card.Body>
              </Card>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="py-2 fw-bold shadow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <FiSave className="me-2" /> Lưu thay đổi
                    </>
                  )}
                </Button>
                <Button
                  variant="danger"
                  className="py-2 fw-bold shadow"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  <FiX className="me-2" /> Hủy bỏ
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MyAccountComponent;
