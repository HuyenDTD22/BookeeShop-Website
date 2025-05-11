import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import NotificationListComponent from "../../../components/admin/notification/NotificationListComponent";
import PaginationComponent from "../../../components/common/PaginationComponent";
import notificationService from "../../../services/admin/notificationService";
import { AuthContext } from "../../../context/AuthContext";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { hasPermission } = useContext(AuthContext);
  const limit = 5; // Số thông báo mỗi trang

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getAllNotifications();
      // Kiểm tra dữ liệu trả về
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu thông báo không hợp lệ!");
      }
      // Kiểm tra ID trùng lặp
      const ids = response.data.map((n) => n._id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        console.warn("Cảnh báo: Có ID thông báo trùng lặp!", ids);
      }
      setNotifications(response.data);
      setTotalItems(response.data.length);
      setTotalPages(Math.ceil(response.data.length / limit));
      // Hiển thị trang đầu tiên
      setDisplayNotifications(response.data.slice(0, limit));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Lấy danh sách thông báo thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("read_notifications")) {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    // Cập nhật danh sách hiển thị khi chuyển trang
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayNotifications(notifications.slice(startIndex, endIndex));
  }, [currentPage, notifications]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (!hasPermission("read_notifications")) {
    return <Container>Không có quyền truy cập.</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <h1 className="fs-3 mb-4">Quản lý thông báo</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <NotificationListComponent
            notifications={displayNotifications}
            onRefresh={fetchNotifications}
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
