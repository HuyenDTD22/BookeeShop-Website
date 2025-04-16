import React from "react";
import { Form, Button } from "react-bootstrap";
import { FiUpload, FiX } from "react-icons/fi";

const UploadImageComponent = ({
  onFileChange,
  imagePreview,
  setImagePreview,
  fieldName = "thumbnail",
  label = "Ảnh",
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Vui lòng chọn file hình ảnh định dạng JPG, PNG hoặc GIF!");
        return;
      }

      // Gọi callback để cập nhật file
      onFileChange(file);
      // Cập nhật preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    onFileChange(null); // Xóa file
  };

  return (
    <div className="mb-3">
      <Form.Label htmlFor={fieldName} className="fw-semibold d-block">
        {label}
      </Form.Label>
      <div className="image-upload-container">
        <div
          className={`image-upload-area ${imagePreview ? "has-preview" : ""}`}
        >
          {imagePreview ? (
            <div className="image-preview-wrapper">
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview img-fluid"
                data-upload-image-preview
              />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={handleRemoveImage}
              >
                <FiX />
              </Button>
            </div>
          ) : (
            <div className="upload-placeholder text-center p-5 border dashed rounded">
              <FiUpload className="mb-2" size={32} />
              <p className="mb-2">Kéo và thả file hoặc nhấn để chọn</p>
              <small className="text-muted">Hỗ trợ: JPG, PNG, GIF</small>
            </div>
          )}
          <Form.Control
            type="file"
            className="image-input"
            id={fieldName}
            name={fieldName}
            accept="image/*"
            onChange={handleFileChange}
            upload-image-input
          />
        </div>
      </div>
    </div>
  );
};

export default UploadImageComponent;
