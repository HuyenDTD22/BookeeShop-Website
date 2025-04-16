import React, { useState } from "react";
import PropTypes from "prop-types";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import "../../assets/styles/OTPVertificationComponent.css";

const OTPVertificationComponent = ({
  onSubmit,
  loading,
  error,
  email,
  onResendOtp,
  resendLoading,
}) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, otp);
  };

  return (
    <div className="card my-5">
      <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit}>
        <h2 className="text-center text-dark mb-4">Xác minh OTP</h2>
        <div className="text-center">
          <img
            src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1743317332/x53hqprqsp82e04jabzd.webp"
            className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
            width="200px"
            alt="profile"
          />
        </div>

        <p className="text-center mb-4">
          Mã OTP đã được gửi đến email <strong>{email}</strong>.<br />
          Vui lòng kiểm tra hộp thư và nhập mã OTP để tiếp tục.
        </p>

        <InputComponent
          type="text"
          id="otp"
          name="otp"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          showLabel={false}
          showPlaceholder={true}
          maxLength={6}
        />

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <div className="text-center mt-4">
          <ButtonComponent
            type="submit"
            loading={loading}
            text={loading ? "Đang xử lý..." : "Xác nhận"}
            disabled={loading}
          />
        </div>

        <div className="form-text text-center mt-4 mb-3">
          <button
            type="button"
            className="btn btn-link text-primary p-0"
            onClick={() => onResendOtp(email)}
            disabled={resendLoading}
          >
            {resendLoading ? "Đang gửi lại..." : "Gửi lại mã OTP"}
          </button>
        </div>
      </form>
    </div>
  );
};

OTPVertificationComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  email: PropTypes.string.isRequired,
  onResendOtp: PropTypes.func.isRequired,
  resendLoading: PropTypes.bool,
};

OTPVertificationComponent.defaultProps = {
  loading: false,
  error: null,
  resendLoading: false,
};

export default OTPVertificationComponent;
