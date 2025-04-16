import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";

const FormGroupComponent = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <Form.Select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="shadow-sm"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

FormGroupComponent.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
};

export default FormGroupComponent;
