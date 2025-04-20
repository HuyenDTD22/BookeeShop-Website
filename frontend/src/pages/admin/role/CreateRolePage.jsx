import React, { useState } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreateRoleComponent from "../../../components/admin/role/CreateRoleComponent";
import { createRole } from "../../../services/admin/roleService";

const ADMIN = process.env.REACT_APP_ADMIN;

const CreateRolePage = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleSubmit = async (roleData) => {
    try {
      const response = await createRole(roleData);
      if (response.code === 200) {
        setToastMessage(response.message);
        setToastVariant("success");
        setShowToast(true);
        navigate(`/${ADMIN}/role`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi tạo danh mục sản phẩm!"
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <Container fluid className="py-4">
      <CreateRoleComponent onSubmit={handleSubmit} />

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

export default CreateRolePage;
