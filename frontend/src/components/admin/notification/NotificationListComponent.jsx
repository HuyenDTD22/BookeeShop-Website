import React, { useState, useContext } from "react";
import { Table, Button, Dropdown, Form, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaPaperPlane, FaClock, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import notificationService from "../../../services/admin/notificationService";

const NotificationListComponent = ({ notifications, onRefresh }) => {
  const navigate = useNavigate();
  const { hasPermission } = useContext(AuthContext);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const typeLabels = {
    system: "Hệ thống",
    promotion: "Khuyến mãi",
    personal: "Cá nhân",
  };

  const statusLabels = {
    draft: "Nháp",
    scheduled: "Đã lên lịch",
    canceled: "Đã hủy",
    sent: "Đã gửi",
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotifications(notifications.map((n) => n._id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedNotifications.length === 0) {
      alert("Vui lòng chọn trạng thái và ít nhất một thông báo!");
      return;
    }
    setActionLoading(true);
    try {
      await notificationService.updateMultipleStatuses(
        selectedNotifications,
        bulkStatus
      );
      alert("Cập nhật trạng thái thành công!");
      setSelectedNotifications([]);
      setBulkStatus("");
      onRefresh();
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Cập nhật trạng thái thất bại!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      alert("Vui lòng chọn ít nhất một thông báo!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa các thông báo đã chọn?")) {
      setActionLoading(true);
      try {
        await notificationService.deleteMultipleNotifications(
          selectedNotifications
        );
        alert("Xóa thông báo thành công!");
        setSelectedNotifications([]);
        onRefresh();
      } catch (error) {
        console.error("Error deleting notifications:", error);
        alert("Xóa thông báo thất bại!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSendNotification = async (id) => {
    if (window.confirm("Bạn có chắc muốn gửi thông báo này ngay?")) {
      setActionLoading(true);
      try {
        const response = await notificationService.sendNotification(id);
        console.log("Send notification response:", response);
        alert("Gửi thông báo thành công!");
        onRefresh();
      } catch (error) {
        console.error("Error sending notification:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        alert("Gửi thông báo thất bại! Vui lòng kiểm tra log console.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleScheduleNotification = async (id) => {
    const sendAt = prompt("Nhập thời gian gửi (YYYY-MM-DD HH:mm:ss):");
    if (sendAt) {
      setActionLoading(true);
      try {
        await notificationService.scheduleNotification(id, sendAt);
        alert("Lên lịch thông báo thành công!");
        onRefresh();
      } catch (error) {
        console.error("Error scheduling notification:", error);
        alert("Lên lịch thông báo thất bại!");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      setActionLoading(true);
      try {
        await notificationService.deleteNotification(id);
        alert("Xóa thông báo thành công!");
        onRefresh();
      } catch (error) {
        console.error("Error deleting notification:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        alert("Xóa thông báo thất bại! Vui lòng kiểm tra log console.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleNavigate = (path, id) => {
    console.log(`Navigating to ${path} with ID: ${id}`);
    navigate(path);
  };

  return (
    <>
      <div className="d-flex justify-content-between gap-3 mb-3">
        {hasPermission("create_notifications") && (
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/${process.env.REACT_APP_ADMIN}/notification/create`)
            }
            disabled={actionLoading}
          >
            Thêm thông báo
          </Button>
        )}
        {hasPermission("update_notifications") && (
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              style={{ width: "200px" }}
              disabled={actionLoading}
            >
              <option value="">Chọn trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="canceled">Đã hủy</option>
            </Form.Select>
            <Button
              variant="success"
              onClick={handleBulkStatusUpdate}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Cập nhật trạng thái"
              )}
            </Button>
          </div>
        )}
        {hasPermission("delete_notifications") && (
          <Button
            variant="danger"
            onClick={handleBulkDelete}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Xóa đã chọn"
            )}
          </Button>
        )}
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedNotifications.length === notifications.length &&
                  notifications.length > 0
                }
                disabled={actionLoading}
              />
            </th>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Thời gian gửi</th>
            <th>Người tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedNotifications.includes(notification._id)}
                  onChange={() => handleSelectNotification(notification._id)}
                  disabled={actionLoading}
                />
              </td>
              <td
                dangerouslySetInnerHTML={{
                  __html: notification.title || "N/A",
                }}
              />
              <td>{typeLabels[notification.type] || notification.type}</td>
              <td>
                {statusLabels[notification.status] || notification.status}
              </td>
              <td>
                {notification.sendAt
                  ? new Date(notification.sendAt).toLocaleString()
                  : "Chưa gửi"}
              </td>
              <td>{notification.createdBy?.fullName || "N/A"}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    size="sm"
                    disabled={actionLoading}
                  >
                    Hành động
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {hasPermission("read_notifications") && (
                      <Dropdown.Item
                        onClick={() =>
                          handleNavigate(
                            `/${process.env.REACT_APP_ADMIN}/notification/detail/${notification._id}`,
                            notification._id
                          )
                        }
                      >
                        <FaEye className="me-2" /> Xem chi tiết
                      </Dropdown.Item>
                    )}
                    {hasPermission("update_notifications") &&
                      notification.status !== "sent" && (
                        <Dropdown.Item
                          onClick={() =>
                            handleNavigate(
                              `/${process.env.REACT_APP_ADMIN}/notification/edit/${notification._id}`,
                              notification._id
                            )
                          }
                        >
                          <FaEdit className="me-2" /> Chỉnh sửa
                        </Dropdown.Item>
                      )}
                    {hasPermission("send_notifications") &&
                      notification.status !== "sent" && (
                        <>
                          <Dropdown.Item
                            onClick={() =>
                              handleSendNotification(notification._id)
                            }
                          >
                            <FaPaperPlane className="me-2" /> Gửi ngay
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleScheduleNotification(notification._id)
                            }
                          >
                            <FaClock className="me-2" /> Lên lịch
                          </Dropdown.Item>
                        </>
                      )}
                    {hasPermission("delete_notifications") && (
                      <Dropdown.Item
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                      >
                        <FaTrash className="me-2" /> Xóa
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default NotificationListComponent;
