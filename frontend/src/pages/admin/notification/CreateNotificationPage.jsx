import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import NotificationFormComponent from "../../../components/admin/notification/NotificationFormComponent";
import { AuthContext } from "../../../context/AuthContext";

const CreateNotificationPage = () => {
  const { hasPermission } = useContext(AuthContext);

  if (!hasPermission("create_notifications")) {
    return <Container>Không có quyền truy cập.</Container>;
  }

  return (
    <Container>
      <h1 className="fs-3 mb-4">Tạo thông báo mới</h1>
      <NotificationFormComponent />
    </Container>
  );
};

export default CreateNotificationPage;
