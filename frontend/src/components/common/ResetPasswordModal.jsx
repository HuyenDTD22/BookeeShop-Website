import React, { useState } from "react";
import PropTypes from "prop-types";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";

const ResetPasswordModal = ({
  isOpen,
  onClose,
  email,
  authService,
  navigate,
  redirectPath = "/",
  title = "Đổi mật khẩu",
  description = "Vui lòng nhập mật khẩu mới để tiếp tục sử dụng tài khoản.",
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authService.resetPassword(password);
      if (response.code === 200) {
        setError("");
        onClose();
        navigate(redirectPath);
      } else {
        setError(response.message || "Có lỗi xảy ra khi đổi mật khẩu.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p className="text-center mb-4">{description}</p>
              <InputComponent
                type="password"
                id="password"
                name="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showLabel={false}
                showPlaceholder={true}
              />
              <InputComponent
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                showLabel={false}
                showPlaceholder={true}
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
                  text={loading ? "Đang xử lý..." : "Lưu mật khẩu"}
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string,
  authService: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  redirectPath: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

ResetPasswordModal.defaultProps = {
  email: "",
  redirectPath: "/",
  title: "Đổi mật khẩu",
  description: "Vui lòng nhập mật khẩu mới để tiếp tục sử dụng tài khoản.",
};

export default ResetPasswordModal;
