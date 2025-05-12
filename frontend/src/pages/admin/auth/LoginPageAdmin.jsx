import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../../components/common/LoginComponent";
import authService from "../../../services/admin/authService";
import { AuthContext } from "../../../context/AuthContext";

const ADMIN = process.env.REACT_APP_ADMIN;

const LoginPageAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  // Kiểm tra an toàn cho context
  if (!context) {
    console.error(
      "AuthContext is undefined. Ensure LoginPageAdmin is wrapped by AuthProvider."
    );
    return <div>Error: AuthContext is not available.</div>;
  }

  const { setUser, setRole, setPermissions } = context;

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess("");

      const response = await authService.login(username, password);

      if (response.code === 200) {
        setSuccess(response.message);
        try {
          const data = await authService.getAuthInfo();
          if (data.code === 200) {
            setUser(data.user);
            setRole(data.role);
            setPermissions(data.role?.permissions || []);
          } else {
            throw new Error("Failed to fetch user info");
          }
        } catch (fetchError) {
          console.error("Failed to fetch user data:", fetchError);
          // Nếu getAuthInfo thất bại, vẫn chuyển hướng
        }
        navigate(`/${ADMIN}/`);
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
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            success={success}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPageAdmin;
