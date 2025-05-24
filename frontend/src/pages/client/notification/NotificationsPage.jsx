import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import NotificationListComponent from "../../../components/client/notification/NotificationListComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import notificationService from "../../../services/client/notificationService";

const NotificationsPage = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      const data = response.data || [];
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu thông báo không hợp lệ!");
      }
      setNotifications(data);
      setTotalItems(data.length);
      setTotalPages(Math.ceil(data.length / limit));
      setDisplayNotifications(data.slice(0, limit));
      setCurrentPage(1);
      const unreadCount = data.filter((n) => !n.isRead).length;
      if (typeof setNotificationCount === "function") {
        setNotificationCount(unreadCount);
      } else {
        console.warn("setNotificationCount is not a function");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      setError(
        error.message || "Lấy danh sách thông báo thất bại! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayNotifications(notifications.slice(startIndex, endIndex));
  }, [currentPage, notifications]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return (
      <Container className="my-4">
        <h1 className="fs-3 mb-4">Thông báo</h1>
        <div className="text-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <NotificationListComponent
            notifications={displayNotifications}
            onRefresh={fetchNotifications}
            setNotifications={setNotifications}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default NotificationsPage;
