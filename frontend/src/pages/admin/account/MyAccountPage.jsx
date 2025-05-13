import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyAccountComponent from "../../../components/admin/account/MyAccountComponent";
import {
  editMyAccount,
  getAccountDetail,
} from "../../../services/admin/accountService";
import authService from "../../../services/admin/authService";

const ADMIN = process.env.REACT_APP_ADMIN;

const MyAccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const authResponse = await authService.getAuthInfo();
        console.log("Auth Response:", authResponse);

        if (
          authResponse.code !== 200 ||
          !authResponse.user ||
          !authResponse.user._id
        ) {
          throw new Error(
            "Không thể xác thực người dùng. Vui lòng đăng nhập lại!"
          );
        }

        const userId = authResponse.user._id;
        console.log("User ID:", userId);

        const response = await getAccountDetail(userId);
        console.log("API Response:", response);

        if (response && Object.keys(response).length > 0) {
          setUserInfo(response);
        } else {
          throw new Error("Không thể lấy thông tin tài khoản");
        }
      } catch (error) {
        setError(error.message || "Đã xảy ra lỗi khi lấy thông tin tài khoản!");
        if (error.message.includes("đăng nhập")) {
          navigate(`/${ADMIN}/auth/login`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (formData) => {
    try {
      const authResponse = await authService.getAuthInfo();
      if (
        authResponse.code !== 200 ||
        !authResponse.user ||
        !authResponse.user._id
      ) {
        throw new Error(
          "Không thể xác thực người dùng. Vui lòng đăng nhập lại!"
        );
      }

      const userId = authResponse.user._id;
      console.log("User ID for edit:", userId);

      const response = await editMyAccount(userId, formData);
      if (response.code === 200) {
        setToastMessage(response.message || "Cập nhật tài khoản thành công!");
        setToastVariant("success");
        setShowToast(true);
        const updatedInfo = await getAccountDetail(userId);
        if (updatedInfo && Object.keys(updatedInfo).length > 0) {
          setUserInfo(updatedInfo);
        }
      } else {
        throw new Error(response.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      setToastMessage(error.message || "Đã xảy ra lỗi khi cập nhật tài khoản!");
      setToastVariant("danger");
      setShowToast(true);
      if (error.message.includes("đăng nhập")) {
        navigate(`/${ADMIN}/auth/login`);
      }
      throw error;
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
      <Row className="mt-4">
        <Col md={12}>
          {userInfo && (
            <MyAccountComponent
              userInfo={userInfo}
              onSubmit={handleSubmit}
              onFileChange={handleFileChange}
            />
          )}
        </Col>
      </Row>
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

export default MyAccountPage;
