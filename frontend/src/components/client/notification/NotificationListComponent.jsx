// import React, { useState } from "react";
// import { ListGroup, Card, Modal, Button, Spinner } from "react-bootstrap";
// import notificationService from "../../../services/client/notificationService";
// import sanitizeHtml from "../../../utils/sanitizeHtml";

// const NotificationListComponent = ({ notifications, onRefresh }) => {
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const typeLabels = {
//     system: "Hệ thống",
//     promotion: "Khuyến mãi",
//     personal: "Cá nhân",
//     order_status: "Cập nhật đơn hàng",
//   };

//   const statusLabels = {
//     sent: "Đã gửi",
//   };

//   const handleViewNotification = async (notification) => {
//     setLoading(true);
//     try {
//       const response = await notificationService.getNotificationById(
//         notification._id
//       );
//       setSelectedNotification(response.data);

//       if (!notification.isRead) {
//         await notificationService.markAsRead(notification._id);
//         onRefresh();
//       }

//       setShowModal(true);
//     } catch (error) {
//       console.error("Error viewing notification:", error);
//       alert(
//         `Không thể xem thông báo: ${
//           error.response?.data?.message || "Lỗi không xác định"
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedNotification(null);
//   };

//   return (
//     <>
//       <Card className="mb-4">
//         <Card.Body>
//           <Card.Title>Danh sách thông báo</Card.Title>
//           <ListGroup variant="flush">
//             {notifications.length === 0 ? (
//               <ListGroup.Item>Không có thông báo nào.</ListGroup.Item>
//             ) : (
//               notifications.map((notification) => (
//                 <ListGroup.Item
//                   key={notification._id}
//                   className="d-flex justify-content-between align-items-center"
//                   style={{
//                     backgroundColor: notification.isRead ? "white" : "#f8f9fa",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => handleViewNotification(notification)}
//                 >
//                   <div>
//                     <strong
//                       dangerouslySetInnerHTML={{
//                         __html: sanitizeHtml(notification.title),
//                       }}
//                     />
//                     <div className="text-muted">
//                       {typeLabels[notification.type] || notification.type} -{" "}
//                       {notification.sendAt
//                         ? new Date(notification.sendAt).toLocaleString()
//                         : "Chưa gửi"}
//                     </div>
//                   </div>
//                 </ListGroup.Item>
//               ))
//             )}
//           </ListGroup>
//         </Card.Body>
//       </Card>

//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedNotification ? (
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: sanitizeHtml(selectedNotification.title),
//                 }}
//               />
//             ) : (
//               "Chi tiết thông báo"
//             )}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {loading ? (
//             <Spinner animation="border" />
//           ) : selectedNotification ? (
//             <>
//               <p>
//                 <strong>Loại:</strong>{" "}
//                 {typeLabels[selectedNotification.type] ||
//                   selectedNotification.type}
//               </p>
//               <p>
//                 <strong>Trạng thái:</strong>{" "}
//                 {statusLabels[selectedNotification.status] ||
//                   selectedNotification.status}
//               </p>
//               <p>
//                 <strong>Thời gian gửi:</strong>{" "}
//                 {selectedNotification.sendAt
//                   ? new Date(selectedNotification.sendAt).toLocaleString()
//                   : "Chưa gửi"}
//               </p>
//               <p>
//                 <strong>Nội dung:</strong>
//                 <br />
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: sanitizeHtml(selectedNotification.content),
//                   }}
//                 />
//               </p>
//             </>
//           ) : (
//             <p>Không có dữ liệu.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Đóng
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default NotificationListComponent;

import React, { useState } from "react";
import { ListGroup, Card, Modal, Button, Spinner } from "react-bootstrap";
import { FiCheckCircle } from "react-icons/fi";
import notificationService from "../../../services/client/notificationService";
import sanitizeHtml from "../../../utils/sanitizeHtml";

const NotificationListComponent = ({
  notifications,
  onRefresh,
  setNotifications,
}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeLabels = {
    system: "Hệ thống",
    promotion: "Khuyến mãi",
    personal: "Cá nhân",
    order_status: "Cập nhật đơn hàng",
  };

  const statusLabels = {
    sent: "Đã gửi",
  };

  const handleViewNotification = async (notification) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotificationById(
        notification._id
      );
      setSelectedNotification(response.data);
      setShowModal(true);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error(
        "Error viewing notification:",
        error.response?.data || error.message
      );
      alert(
        `Không thể xem thông báo: ${
          error.response?.data?.message || "Lỗi không xác định"
        }`
      );
    } finally {
      setLoading(false);
      console.log("Loading state:", false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
    onRefresh();
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Danh sách thông báo</Card.Title>
          <ListGroup variant="flush">
            {notifications.length === 0 ? (
              <ListGroup.Item>Không có thông báo nào.</ListGroup.Item>
            ) : (
              notifications.map((notification) => (
                <ListGroup.Item
                  key={notification._id}
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: notification.isRead ? "white" : "#f8f9fa",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewNotification(notification)}
                >
                  <div>
                    <strong
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(notification.title),
                      }}
                    />
                    <div className="text-muted">
                      {typeLabels[notification.type] || notification.type} -{" "}
                      {notification.sendAt
                        ? new Date(notification.sendAt).toLocaleString()
                        : new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {notification.isRead && (
                    <div className="d-flex align-items-center text-success">
                      <FiCheckCircle className="me-1" />
                      <span>Đã xem</span>
                    </div>
                  )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNotification ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(selectedNotification.title),
                }}
              />
            ) : (
              "Chi tiết thông báo"
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner animation="border" />
          ) : selectedNotification ? (
            <>
              <p>
                <strong>Loại:</strong>{" "}
                {typeLabels[selectedNotification.type] ||
                  selectedNotification.type}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {statusLabels[selectedNotification.status] ||
                  selectedNotification.status}
              </p>
              <p>
                <strong>Thời gian gửi:</strong>{" "}
                {selectedNotification.sendAt
                  ? new Date(selectedNotification.sendAt).toLocaleString()
                  : new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Nội dung:</strong>
                <br />
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(selectedNotification.content),
                  }}
                />
              </p>
            </>
          ) : (
            <p>Không có dữ liệu.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationListComponent;
