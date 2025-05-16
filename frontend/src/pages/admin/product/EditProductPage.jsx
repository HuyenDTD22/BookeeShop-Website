import React, { useState, useEffect } from "react";
import {
  Container,
  Toast,
  ToastContainer,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import EditProductComponent from "../../../components/admin/product/EditProductComponent";
import { getBookDetail, editBook } from "../../../services/admin/bookService";

const ADMIN = process.env.REACT_APP_ADMIN;

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const data = await getBookDetail(id);
        setBook(data);
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
      const response = await editBook(id, formData);
      if (response.code === 200) {
        setToastMessage(response.message);
        setToastVariant("success");
        setShowToast(true);
        navigate(`/${ADMIN}/book`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi chỉnh sửa sản phẩm!");
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
      <EditProductComponent book={book} onSubmit={handleSubmit} />

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
