import React, { useState, useEffect } from "react";
import {
  Container,
  Toast,
  ToastContainer,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import EditAccountComponent from "../../../components/admin/account/EditAccountComponent";
import {
  getAccountDetail,
  editAccount,
} from "../../../services/admin/accountService";

const ADMIN = process.env.REACT_APP_ADMIN;

const EditAccountPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Lấy dữ liệu sản phẩm để điền sẵn vào form
  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        setLoading(true);
        const data = await getAccountDetail(id);
        setAccount(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchAccountDetail();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const response = await editAccount(id, formData);
      if (response.code === 200) {
        setToastMessage(response.message);
        setToastVariant("success");
        setShowToast(true);
        navigate(`/${ADMIN}/account`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setToastMessage(
        error.message || "Đã xảy ra lỗi khi chỉnh sửa tài khoản!"
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
      <EditAccountComponent account={account} onSubmit={handleSubmit} />

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

export default EditAccountPage;
