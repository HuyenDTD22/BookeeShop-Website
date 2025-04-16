import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/common/LoginComponent";
import authService from "../../services/admin/authService";

const ADMIN = process.env.REACT_APP_ADMIN;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess("");

      const response = await authService.login(username, password);

      if (response.code === 200) {
        setSuccess(response.message);
        localStorage.setItem("token", response.token);
        navigate(`/${ADMIN}`);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
