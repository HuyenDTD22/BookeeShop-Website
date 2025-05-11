import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import notificationService from "../../../services/admin/notificationService";
import { AuthContext } from "../../../context/AuthContext";
import sanitizeHtml from "../../../utils/sanitizeHtml";

const NotificationDetailPage = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [readByUsers, setReadByUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { hasPermission } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);
      setError(null);

      try {
        const notificationRes = await notificationService.getNotificationById(
          id
        );
        setNotification(notificationRes.data);

        try {
          const readByRes = await notificationService.getReadByUsers(id);
          setReadByUsers(readByRes.data);
        } catch (readError) {
          console.error("Error fetching readBy users:", readError);
          setReadByUsers([]);
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
        setError("Lấy thông báo thất bại! Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (hasPermission("read_notifications")) {
      fetchNotification();
    }
  }, [id]);

  if (!hasPermission("read_notifications")) {
    return <Container>Không có quyền truy cập.</Container>;
  }

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  if (!notification) {
    return <Container>Thông báo không tồn tại.</Container>;
  }

  return (
    <Container>
      <h1 className="fs-3 mb-4">Chi tiết thông báo</h1>
      <Table bordered>
        <tbody>
          <tr>
            <td>
              <strong>Tiêu đề</strong>
            </td>
            <td
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(notification.title || "N/A"),
              }}
            />
          </tr>
          <tr>
            <td>
              <strong>Nội dung</strong>
            </td>
            <td
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(notification.content || "N/A"),
              }}
            />
          </tr>
          <tr>
            <td>
              <strong>Loại</strong>
            </td>
            <td>{notification.type || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Trạng thái</strong>
            </td>
            <td>{notification.status || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Đối tượng</strong>
            </td>
            <td>
              {notification.target?.type === "all"
                ? "Tất cả"
                : notification.target?.type === "group"
                ? `Nhóm: ${notification.target.groupId || "N/A"}`
                : `Cụ thể: ${
                    (notification.target?.userIds || []).join(", ") || "N/A"
                  }`}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Thời gian gửi</strong>
            </td>
            <td>
              {notification.sendAt
                ? new Date(notification.sendAt).toLocaleString()
                : "Chưa gửi"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Người tạo</strong>
            </td>
            <td>{notification.createdBy?.fullName || "N/A"}</td>
          </tr>
        </tbody>
      </Table>

      <h3 className="fs-4 mt-4">Danh sách khách hàng đã đọc</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {readByUsers.length > 0 ? (
            readByUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>Chưa có khách hàng nào đọc.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default NotificationDetailPage;
