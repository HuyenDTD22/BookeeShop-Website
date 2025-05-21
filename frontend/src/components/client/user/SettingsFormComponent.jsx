// import React, { useState, useEffect } from "react";
// import { Form, Button, Alert, Card } from "react-bootstrap";
// import authService from "../../../services/client/authService";
// import UploadImageComponent from "../../common/UploadImageComponent";

// const SettingsFormComponent = ({ user, setUserInfo }) => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     gender: "",
//     email: "",
//     address: "",
//     oldPassword: "",
//     password: "",
//     confirmPassword: "",
//     avatar: "",
//   });
//   const [imagePreview, setImagePreview] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     if (user) {
//       // Ánh xạ giá trị gender từ server sang client
//       const genderMap = {
//         Nam: "male",
//         Nữ: "female",
//         other: "other",
//       };
//       const clientGender = genderMap[user.gender] || "other";

//       setFormData({
//         fullName: user.fullName || "",
//         phone: user.phone || "",
//         gender: clientGender,
//         email: user.email || "",
//         address: user.address || "",
//         oldPassword: "",
//         password: "",
//         confirmPassword: "",
//         avatar: user.avatar || "",
//       });
//       setImagePreview(user.avatar || "");
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (file) => {
//     setFormData({ ...formData, avatar: file || "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (formData.password && formData.password !== formData.confirmPassword) {
//       setError("Mật khẩu và xác nhận mật khẩu không khớp!");
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("fullName", formData.fullName);
//       data.append("phone", formData.phone);
//       // Chuyển đổi gender từ client sang server
//       const genderMapReverse = {
//         male: "Nam",
//         female: "Nữ",
//         other: "other",
//       };
//       data.append(
//         "gender",
//         genderMapReverse[formData.gender] || formData.gender
//       );
//       data.append("address", formData.address);
//       if (formData.oldPassword && formData.password) {
//         data.append("oldPassword", formData.oldPassword);
//         data.append("password", formData.password);
//         data.append("confirmPassword", formData.confirmPassword);
//       }
//       if (formData.avatar && formData.avatar instanceof File) {
//         data.append("avatar", formData.avatar);
//       }

//       console.log("FormData:", [...data.entries()]);

//       const response = await authService.updateUserInfo(data);
//       setUserInfo(response.info);
//       setSuccess("Cập nhật thông tin thành công!");
//     } catch (error) {
//       console.error("Update error:", error);
//       setError(error.response?.data?.message || "Đã xảy ra lỗi");
//     }
//   };

//   return (
//     <Card.Body className="bg-light">
//       <Form onSubmit={handleSubmit}>
//         <UploadImageComponent
//           onFileChange={handleImageChange}
//           imagePreview={imagePreview}
//           setImagePreview={setImagePreview}
//           fieldName="avatar"
//           label="Ảnh đại diện"
//         />
//         <Form.Group className="mb-3">
//           <Form.Label>Họ và tên</Form.Label>
//           <Form.Control
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Số điện thoại</Form.Label>
//           <Form.Control
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Giới tính</Form.Label>
//           <Form.Select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//           >
//             <option value="male">Nam</option>
//             <option value="female">Nữ</option>
//             <option value="other">Khác</option>
//           </Form.Select>
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Email</Form.Label>
//           <Form.Control
//             type="email"
//             name="email"
//             value={formData.email}
//             disabled
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Địa chỉ</Form.Label>
//           <Form.Control
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Mật khẩu cũ</Form.Label>
//           <Form.Control
//             type="password"
//             name="oldPassword"
//             value={formData.oldPassword}
//             onChange={handleChange}
//             placeholder="Nhập mật khẩu cũ"
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Mật khẩu mới</Form.Label>
//           <Form.Control
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Nhập mật khẩu mới"
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Xác nhận mật khẩu</Form.Label>
//           <Form.Control
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             placeholder="Nhập lại mật khẩu"
//           />
//         </Form.Group>
//         <div className="d-flex justify-content-center">
//           <Button variant="primary" type="submit">
//             Lưu thay đổi
//           </Button>
//         </div>
//         {error && (
//           <Alert variant="danger" className="mt-3">
//             {error}
//           </Alert>
//         )}
//         {success && (
//           <Alert variant="success" className="mt-3">
//             {success}
//           </Alert>
//         )}
//       </Form>
//     </Card.Body>
//   );
// };

// export default SettingsFormComponent;

import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import authService from "../../../services/client/authService";
import UploadImageComponent from "../../common/UploadImageComponent";

const SettingsFormComponent = ({ user, setUserInfo }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    email: "",
    address: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      // Ánh xạ giá trị gender từ server sang client
      const genderMap = {
        Nam: "male",
        Nữ: "female",
        other: "other",
      };
      const clientGender = genderMap[user.gender] || "other";

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        gender: clientGender,
        email: user.email || "",
        address: user.address || "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        avatar: user.avatar || "",
      });
      setImagePreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, avatar: file || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);
      // Chuyển đổi gender từ client sang server
      const genderMapReverse = {
        male: "Nam",
        female: "Nữ",
        other: "other",
      };
      data.append(
        "gender",
        genderMapReverse[formData.gender] || formData.gender
      );
      data.append("address", formData.address);
      if (formData.oldPassword && formData.password) {
        data.append("oldPassword", formData.oldPassword);
        data.append("password", formData.password);
        data.append("confirmPassword", formData.confirmPassword);
      }
      if (formData.avatar && formData.avatar instanceof File) {
        data.append("avatar", formData.avatar);
      }

      console.log("FormData:", [...data.entries()]);

      const response = await authService.updateUserInfo(data);
      setUserInfo(response.info);
      setSuccess("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <Card.Body className="bg-light">
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Cột 1: Ảnh đại diện, Họ và tên, Số điện thoại, Giới tính */}
          <Col xs={12} md={6}>
            <UploadImageComponent
              onFileChange={handleImageChange}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              fieldName="avatar"
              label="Ảnh đại diện"
            />
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {/* Cột 2: Email, Địa chỉ, Mật khẩu cũ, Mật khẩu mới, Xác nhận mật khẩu */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu cũ"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Nút Lưu thay đổi và thông báo */}
        <div className="d-flex justify-content-center mt-1">
          <Button variant="primary" type="submit">
            Lưu thay đổi
          </Button>
        </div>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mt-3">
            {success}
          </Alert>
        )}
      </Form>
    </Card.Body>
  );
};

export default SettingsFormComponent;
