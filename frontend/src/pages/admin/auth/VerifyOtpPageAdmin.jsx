import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPVertificationComponent from "../../../components/common/OTPVertificationComponent";
import authService from "../../../services/admin/authService";

const ADMIN = process.env.REACT_APP_ADMIN;

const VerifyOtpPageAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state?.email ||
      localStorage.getItem("forgotPasswordEmailAdmin") ||
      ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleVerifyOtp = async (email, otp) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.verifyOtp(email, otp);

      if (response.code === 200) {
        setSuccess(response.message);
        localStorage.setItem("jwt", response.token);
        navigate(`/${ADMIN}/`, {
          state: { showResetModal: true, email },
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi xác nhận OTP. Vui lòng thử lại sau.");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (email) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await authService.forgotPassword(email);
      if (response.code === 200) {
        setSuccess("Mã OTP mới đã được gửi đến email của bạn!");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Có lỗi khi gửi lại OTP. Vui lòng thử lại sau.");
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <OTPVertificationComponent
            onSubmit={handleVerifyOtp}
            loading={loading}
            error={error}
            email={email}
            onResendOtp={handleResendOtp}
            resendLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPageAdmin;
