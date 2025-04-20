import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const ConfirmModal = ({
  show,
  onHide,
  title,
  body,
  confirmButton,
  cancelButton = { label: "Hủy", variant: "secondary" },
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant={cancelButton.variant || "secondary"}
          onClick={onHide}
          disabled={confirmButton.loading}
        >
          {cancelButton.label || "Hủy"}
        </Button>
        <Button
          variant={confirmButton.variant || "primary"}
          onClick={confirmButton.onClick}
          disabled={confirmButton.loading}
        >
          {confirmButton.loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : null}
          {confirmButton.label}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
