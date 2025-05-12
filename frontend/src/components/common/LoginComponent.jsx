import React, { useState } from "react";
import PropTypes from "prop-types";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import "../../styles/client/component/LoginComponent.css";

const ADMIN = process.env.REACT_APP_ADMIN;

const LoginForm = ({ onSubmit, loading, error, success, isAdmin = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const forgotPasswordPath = isAdmin
    ? `/${ADMIN}/auth/forgot-password`
    : "/user/password/forgot";

  return (
    <div className="card my-5">
      <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit}>
        <h2 className="text-center text-dark mb-4">Đăng nhập</h2>
        <div className="text-center">
          <img
            src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1743317332/x53hqprqsp82e04jabzd.webp"
            className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
            width="200px"
            alt="profile"
          />
        </div>

        <InputComponent
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          showLabel={false}
          showPlaceholder={true}
        />

        <InputComponent
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          showLabel={false}
          showPlaceholder={true}
        />

        <div className="d-flex justify-content-end mb-3">
          <a
            href={forgotPasswordPath}
            className="text-primary text-decoration-none"
          >
            Quên mật khẩu?
          </a>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mt-3" role="alert">
            {success}
          </div>
        )}

        <div className="text-center">
          <ButtonComponent
            type="submit"
            loading={loading}
            text={loading ? "Đang xử lý..." : "Đăng nhập"}
            disabled={loading}
          />
        </div>

        <div className="form-text text-center mb-5 text-dark">
          Bạn chưa có tài khoản?{" "}
          <a href="/user/register" className="text-dark fw-bold">
            Đăng ký
          </a>
        </div>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  isAdmin: PropTypes.bool,
};

LoginForm.defaultProps = {
  loading: false,
  error: null,
  success: null,
  isAdmin: false,
};

export default LoginForm;
