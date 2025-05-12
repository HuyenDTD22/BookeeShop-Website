import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../../components/client/user/RegisterComponent";
import authService from "../../../services/client/authService";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const {
        fullName,
        email,
        password,
        confirmPassword,
        phone,
        gender,
        address,
      } = formData;

      const response = await authService.register(
        fullName,
        email,
        password,
        confirmPassword,
        phone,
        gender,
        address
      );
      if (response.code === 200) {
        setSuccess(response.message);
        navigate("/user/login");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
