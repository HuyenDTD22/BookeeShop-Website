import React, { useState } from "react";
import PropTypes from "prop-types";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import "../../assets/styles/ForgotPasswordComponent.css";

const ForgotPasswordComponent = ({ onSubmit, loading, error, success }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="card my-5">
      <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit}>
        <h2 className="text-center text-dark mb-4">Quên mật khẩu</h2>
        <div className="text-center">
          <img
            src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1743317332/x53hqprqsp82e04jabzd.webp"
            className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
            width="200px"
            alt="profile"
          />
        </div>

        <p className="text-center mb-4">
          Vui lòng nhập email của bạn để nhận mã OTP xác minh.
        </p>

        <InputComponent
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          showLabel={false}
          showPlaceholder={true}
        />

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mt-3" role="alert">
            {success}
          </div>
        )}

        <div className="text-center mt-4">
          <ButtonComponent
            type="submit"
            loading={loading}
            text={loading ? "Đang xử lý..." : "Gửi mã OTP"}
            disabled={loading}
          />
        </div>

        <div className="form-text text-center mt-4 mb-3 text-dark">
          <a href="/user/login" className="text-primary text-decoration-none">
            Quay lại đăng nhập
          </a>
        </div>
      </form>
    </div>
  );
};

ForgotPasswordComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
};

ForgotPasswordComponent.defaultProps = {
  loading: false,
  error: null,
  success: null,
};

export default ForgotPasswordComponent;
