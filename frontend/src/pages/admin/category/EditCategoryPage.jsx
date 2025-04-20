import React, { useState, useEffect } from "react";
import {
  Container,
  Toast,
  ToastContainer,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import EditCategoryComponent from "../../../components/admin/category/EditCategoryComponent";
import {
  getCategoryDetail,
  editCategory,
} from "../../../services/admin/categoryService";

const ADMIN = process.env.REACT_APP_ADMIN;

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const data = await getCategoryDetail(id);
        setCategory(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const response = await editCategory(id, formData);
      if (response.code === 200) {
        setToastMessage(response.message);
        setToastVariant("success");
        setShowToast(true);
        navigate(`/${ADMIN}/category`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi chỉnh sửa danh mục sản phẩm!"
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <EditCategoryComponent category={category} onSubmit={handleSubmit} />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={10000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Thành công" : "Lỗi"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default EditProductPage;
