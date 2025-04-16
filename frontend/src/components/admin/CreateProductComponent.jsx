import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, Card } from "react-bootstrap";
import { FiSave, FiX, FiUpload, FiPackage } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputComponent from "../common/InputComponent";
import FormGroupComponent from "../common/FormGroupComponent";
import quillConfig from "../../utils/quillConfig";
import SelectTreeComponent from "../common/SelectTreeComponent";
import "../../assets/styles/CreateProductComponent.css";
import { getCategory } from "../../services/admin/categoryService";
import UploadImageComponent from "../common/UploadImageComponent";
import CategorySelectComponent from "../common/CategorySelectComponent";

const CreateProductComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    position: "",
    status: "active",
    discountPercentage: "",
    stock: "",
    book_category_id: "",
    description: "",
    thumbnail: null,
    feature: "0",
    author: "",
    supplier: "",
    publisher: "",
    publish_year: "",
    language: "",
    size: "",
    weight: "",
    page_count: "",
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
    setFormData((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo FormData để gửi dữ liệu dưới dạng multipart/form-data
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("position", formData.position);
    formDataToSubmit.append("status", formData.status);
    formDataToSubmit.append("discountPercentage", formData.discountPercentage);
    formDataToSubmit.append("stock", formData.stock);
    formDataToSubmit.append("book_category_id", formData.book_category_id);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("feature", formData.feature);
    formDataToSubmit.append("author", formData.author); // Thêm các trường mới
    formDataToSubmit.append("supplier", formData.supplier);
    formDataToSubmit.append("publisher", formData.publisher);
    formDataToSubmit.append("publish_year", formData.publish_year);
    formDataToSubmit.append("language", formData.language);
    formDataToSubmit.append("size", formData.size);
    formDataToSubmit.append("weight", formData.weight);
    formDataToSubmit.append("page_count", formData.page_count);

    if (formData.thumbnail) {
      formDataToSubmit.append("thumbnail", formData.thumbnail);
    }

    onSubmit(formDataToSubmit);
  };

  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Dừng hoạt động" },
  ];

  const FeatureOptions = [
    { value: "0", label: "Sản phẩm bình thường" },
    { value: "1", label: "Sản phẩm nổi bật" },
  ];

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <FiPackage className="me-2" size={24} />
          <h2 className="m-0 fs-4">Thêm mới sản phẩm</h2>
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
                    id="title"
                    name="title"
                    placeholder="Tiêu đề"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  />

                  <CategorySelectComponent
                    value={formData.book_category_id}
                    onChange={handleChange}
                    name="book_category_id"
                    label="Danh mục"
                    className="shadow-sm"
                  />

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Mô tả</Form.Label>
                    <div className="quill-editor-container">
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        modules={quillConfig.modules}
                        formats={quillConfig.formats}
                        placeholder="Nhập mô tả sản phẩm..."
                        className="editor-height"
                      />
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Hình ảnh sản phẩm
                  </h5>
                  <UploadImageComponent
                    onFileChange={handleFileChange}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    fieldName="thumbnail"
                    label="Ảnh"
                  />
                </Card.Body>
              </Card>

              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">Giá & Kho</h5>

                  <InputComponent
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Giá"
                    value={formData.price}
                    onChange={handleChange}
                    required={true}
                    min="0"
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    placeholder="% Giảm giá"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Số lượng"
                    value={formData.stock}
                    onChange={handleChange}
                    required={true}
                    min="0"
                    className="shadow-sm"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">
                    Thông tin chi tiết
                  </h5>

                  <InputComponent
                    type="text"
                    id="author"
                    name="author"
                    placeholder="Tác giả"
                    value={formData.author}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="supplier"
                    name="supplier"
                    placeholder="Nhà cung cấp"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="publisher"
                    name="publisher"
                    placeholder="Nhà xuất bản"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="publish_year"
                    name="publish_year"
                    placeholder="Năm xuất bản"
                    value={formData.publish_year}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="language"
                    name="language"
                    placeholder="Ngôn ngữ"
                    value={formData.language}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="size"
                    name="size"
                    placeholder="Kích thước (ví dụ: 14x20 cm)"
                    value={formData.size}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="Trọng lượng (ví dụ: 500g)"
                    value={formData.weight}
                    onChange={handleChange}
                    className="shadow-sm"
                  />

                  <InputComponent
                    type="text"
                    id="page_count"
                    name="page_count"
                    placeholder="Số trang"
                    value={formData.page_count}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Card.Body>
              </Card>

              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title border-bottom pb-2">Cài đặt</h5>

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

                  <FormGroupComponent
                    label="Nổi bật"
                    name="feature"
                    value={formData.feature}
                    onChange={handleChange}
                    options={FeatureOptions}
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

export default CreateProductComponent;
