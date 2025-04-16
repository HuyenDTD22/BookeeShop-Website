import React, { useState } from "react";
import InputComponent from "../common/InputComponent";
import ButtonComponent from "../common/ButtonComponent";

const RegisterComponent = ({ onSubmit, loading, error, success }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="card my-5">
      <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit}>
        <h2 className="text-center text-dark mb-4">Đăng ký tài khoản</h2>

        <div className="text-center">
          <img
            src="https://res.cloudinary.com/dmmdzacfp/image/upload/v1743317332/x53hqprqsp82e04jabzd.webp"
            className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
            width="200px"
            alt="profile"
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <InputComponent
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Họ tên"
              value={formData.fullName}
              onChange={handleChange}
              required
              showLabel={true}
              showPlaceholder={false}
            />
          </div>

          <div className="col-md-6">
            <InputComponent
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              showLabel={true}
              showPlaceholder={false}
            />
          </div>
        </div>

        <InputComponent
          type="password"
          id="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          showLabel={true}
          showPlaceholder={false}
        />

        <InputComponent
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          showLabel={true}
          showPlaceholder={false}
        />

        <div className="row">
          <div className="col-md-6">
            <InputComponent
              type="tel"
              id="phone"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
              showLabel={true}
              showPlaceholder={false}
            />
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
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
            text={loading ? "Đang xử lý..." : "Đăng ký"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;
