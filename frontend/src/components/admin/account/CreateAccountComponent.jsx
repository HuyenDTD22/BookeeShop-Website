import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, Card } from "react-bootstrap";
import { FiSave, FiX, FiUpload, FiPackage } from "react-icons/fi";
import InputComponent from "../../common/InputComponent";
import FormGroupComponent from "../../common/FormGroupComponent";
import UploadImageComponent from "../../common/UploadImageComponent";
import { getRoles } from "../../../services/admin/roleService";
import RoleSelectorComponent from "../role/RoleSelectorComponent";

const CreateAccountComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    avatar: "",
    fullName: "",
    role_id: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birth: "",
    gender: "",
    address: "",
    status: "active",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("fullName", formData.fullName);
    formDataToSubmit.append("role_id", formData.role_id);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("confirmPassword", formData.confirmPassword);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("birth", formData.birth);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("status", formData.status);

    if (formData.avatar) {
      formDataToSubmit.append("avatar", formData.avatar);
    }

    onSubmit(formDataToSubmit);
  };

  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Dừng hoạt động" },
  ];

  const genderOptions = [
    { value: "", label: "Chọn giới tính" },
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
  ];

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <FiPackage className="me-2" size={24} />
          <h2 className="m-0 fs-4">Thêm mới tài khoản</h2>
        </div>
      </Card.Header>
      <Card.Body className="bg-light">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Thông tin cơ bản
                  </h5>

                  <InputComponent
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Họ Tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="date"
                    id="birth"
                    name="birth"
                    placeholder="Ngày sinh"
                    value={formData.birth}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <FormGroupComponent
                    label="Giới tính"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={genderOptions}
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">Avatar</h5>
                  <UploadImageComponent
                    onFileChange={handleFileChange}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    fieldName="avatar"
                    label="Ảnh"
                  />
                </Card.Body>
              </Card>

              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">Cài đặt</h5>

                  <RoleSelectorComponent
                    label="Phân quyền"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                  />

                  <FormGroupComponent
                    label="Trạng thái"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                  />
                </Card.Body>
              </Card>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="py-2 fw-bold shadow"
                >
                  <FiSave className="me-2" /> Tạo mới
                </Button>
                <Button
                  variant="danger"
                  className="py-2 fw-bold"
                  onClick={() => window.history.back()}
                >
                  <FiX className="me-2" /> Hủy
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateAccountComponent;
