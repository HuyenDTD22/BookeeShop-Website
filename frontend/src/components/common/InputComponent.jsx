import React from "react";
import PropTypes from "prop-types";

const InputComponent = ({
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
  required,
  showLabel,
  showPlaceholder,
  min,
  className = "",
}) => {
  return (
    <div className="mb-3">
      {showLabel && (
        <label htmlFor={id} className="form-label fw-semibold">
          {placeholder}
        </label>
      )}
      <input
        type={type}
        className={`form-control ${className}`}
        id={id}
        name={name}
        placeholder={showPlaceholder ? placeholder : ""}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
      />
    </div>
  );
};

InputComponent.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  min: PropTypes.string,
  className: PropTypes.string,
};

InputComponent.defaultProps = {
  required: false,
  showLabel: true,
  showPlaceholder: true,
};

export default InputComponent;
