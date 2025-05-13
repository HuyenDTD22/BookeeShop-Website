import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { FiSave, FiX, FiPackage } from "react-icons/fi";
import InputComponent from "../../common/InputComponent";
import FormGroupComponent from "../../common/FormGroupComponent";
import CategorySelectComponent from "../../common/CategorySelectComponent";
import UploadImageComponent from "../../common/UploadImageComponent";

const CreateCategoryComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    status: "active",
    parent_id: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    if (formData.thumbnail) {
      formDataToSubmit.append("thumbnail", formData.thumbnail);
    }
    formDataToSubmit.append("status", formData.status);
    formDataToSubmit.append("parent_id", formData.parent_id);

    onSubmit(formDataToSubmit);
  };

  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Dừng hoạt động" },
  ];

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <FiPackage className="me-2" size={24} />
          <h2 className="m-0 fs-4">Thêm mới danh mục</h2>
        </div>
      </Card.Header>
      <Card.Body className="bg-light">
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6}>
              <Card className="shadow-sm mb-4 basic-info-card">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Thông tin cơ bản
                  </h5>

                  <InputComponent
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Tiêu đề"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <CategorySelectComponent
                    value={formData.parent_id}
                    onChange={handleChange}
                    name="parent_id"
                    label="Danh mục"
                    className="shadow-sm"
                  />

                  <h5 className="card-title border-bottom pb-2">
                    Hình ảnh danh mục
                  </h5>
                  <UploadImageComponent
                    onFileChange={handleFileChange}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    fieldName="thumbnail"
                    label="Ảnh"
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

export default CreateCategoryComponent;
