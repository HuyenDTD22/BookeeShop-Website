import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordComponent from "../../../components/common/ForgotPasswordComponent";
import authService from "../../../services/admin/authService";

const ADMIN = process.env.REACT_APP_ADMIN;

const ForgotPasswordPageAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (email) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.forgotPassword(email);

      if (response.code === 200) {
        setSuccess(response.message);
        navigate(`/${ADMIN}/auth/verify-otp`, { state: { email } });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi gửi OTP tới email. Vui lòng thử lại sau.");
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordComponent
            onSubmit={handleSendOtp}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPageAdmin;
