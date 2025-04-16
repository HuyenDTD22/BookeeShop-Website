import React from "react";
import PropTypes from "prop-types";

const ButtonComponent = ({ type, onClick, disabled, loading, text }) => {
  return (
    <button
      type={type}
      className="btn btn-primary px-5 mt-4 w-100"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? "Đang xử lý..." : text}
    </button>
  );
};

ButtonComponent.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  text: PropTypes.string,
};

ButtonComponent.defaultProps = {
  type: "button",
  onClick: () => {},
  disabled: false,
  loading: false,
  text: "Submit",
};

export default ButtonComponent;
