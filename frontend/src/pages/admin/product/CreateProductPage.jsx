import React, { useState } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreateProductComponent from "../../../components/admin/product/CreateProductComponent";
import { createBook } from "../../../services/admin/bookService";

const ADMIN = process.env.REACT_APP_ADMIN;

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleSubmit = async (formData) => {
    try {
      const response = await createBook(formData);
      if (response.code === 200) {
        setToastMessage(response.message);
        setToastVariant("success");
        setShowToast(true);
        navigate(`/${ADMIN}/book`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi tạo sản phẩm!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <Container fluid className="py-4">
      <CreateProductComponent onSubmit={handleSubmit} />

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

export default CreateProductPage;
