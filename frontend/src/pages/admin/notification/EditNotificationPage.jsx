import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import NotificationFormComponent from "../../../components/admin/notification/NotificationFormComponent";
import notificationService from "../../../services/admin/notificationService";
import { AuthContext } from "../../../context/AuthContext";

const EditNotificationPage = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);
      try {
        const response = await notificationService.getNotificationById(id);
        setNotification(response.data);
      } catch (error) {
        alert("Lấy thông báo thất bại!");
      } finally {
        setLoading(false);
      }
    };

    if (hasPermission("update_notifications")) {
      fetchNotification();
    }
  }, [id]);

  if (!hasPermission("update_notifications")) {
    return <Container>Không có quyền truy cập.</Container>;
  }

  if (loading) {
    return (
      <Container>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!notification) {
    return <Container>Thông báo không tồn tại.</Container>;
  }

  return (
    <Container>
      <h1 className="fs-3 mb-4">Chỉnh sửa thông báo</h1>
      <NotificationFormComponent notification={notification} isEdit />
    </Container>
  );
};

export default EditNotificationPage;
