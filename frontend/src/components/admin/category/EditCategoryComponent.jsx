import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, Card } from "react-bootstrap";
import { FiSave, FiX, FiUpload, FiPackage } from "react-icons/fi";
import InputComponent from "../../common/InputComponent";
import FormGroupComponent from "../../common/FormGroupComponent";
import CategorySelectComponent from "../../common/CategorySelectComponent";

const EditCategoryComponent = ({ category, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    status: "",
    parent_id: "",
  });

  // Điền dữ liệu sản phẩm vào form khi component mount
  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title || "",
        position: category.position || "",
        status: category.status || "active",
        parent_id: category.parent_id || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryData = {
      title: formData.title,
      position: formData.position,
      status: formData.status,
      parent_id: formData.parent_id,
    };

    onSubmit(categoryData);
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
          <h2 className="m-0 fs-4">Chỉnh sửa danh mục</h2>
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

                  <InputComponent
                    type="number"
                    id="position"
                    name="position"
                    placeholder="Vị trí"
                    value={formData.position}
                    onChange={handleChange}
                    min="0"
                    className="shadow-sm"
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
                  <FiSave className="me-2" /> Lưu thay đổi
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

export default EditCategoryComponent;
