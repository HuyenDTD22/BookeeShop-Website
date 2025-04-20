import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, Card } from "react-bootstrap";
import { FiSave, FiX, FiUpload, FiPackage } from "react-icons/fi";
import InputComponent from "../../common/InputComponent";
import FormGroupComponent from "../../common/FormGroupComponent";

const EditRoleComponent = ({ role, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        title: role.title || "",
        description: role.description || "",
        status: role.status || "active",
      });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const roleData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
    };

    onSubmit(roleData);
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
          <h2 className="m-0 fs-4">Chỉnh sửa nhóm quyền</h2>
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

                  <InputComponent
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Vị trí"
                    value={formData.description}
                    onChange={handleChange}
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

export default EditRoleComponent;
