// import React, { useContext } from "react";
// import { Navbar, Nav } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaList,
//   FaFolder,
//   FaUserShield,
//   FaUserFriends,
//   FaUsers,
//   FaCog,
//   FaBookOpen,
//   FaShoppingCart,
//   FaStar,
//   FaBell,
// } from "react-icons/fa";
// import { AuthContext } from "../../../context/AuthContext";

// const ADMIN = process.env.REACT_APP_ADMIN;

// const SiderComponent = () => {
//   const { hasPermission } = useContext(AuthContext);

//   return (
//     <div
//       className="bg-dark text-white position-fixed"
//       style={{
//         width: "250px",
//         height: "100vh",
//         overflowY: "auto",
//         top: 0,
//         left: 0,
//         zIndex: 1000,
//       }}
//     >
//       <div className="p-3">
//         <Navbar.Brand
//           href={`/${ADMIN}`}
//           className="brand-logo d-flex align-items-center"
//         >
//           <FaBookOpen className="me-2" size={30} color="white" />
//           <span
//             className="fw-bold"
//             style={{ color: "white", fontSize: "25px" }}
//           >
//             BookeeShop
//           </span>
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="navbarScroll" />
//       </div>
//       <Nav className="flex-column">
//         <NavLink
//           to={`/${ADMIN}`}
//           className={({ isActive }) =>
//             `nav-link text-white ${isActive ? "bg-primary" : ""}`
//           }
//           end={true}
//         >
//           <FaHome className="me-2" /> Tổng quan
//         </NavLink>
//         {hasPermission("read_books") && (
//           <NavLink
//             to={`/${ADMIN}/book`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaList className="me-2" /> Danh sách sản phẩm
//           </NavLink>
//         )}
//         {hasPermission("read_categories") && (
//           <NavLink
//             to={`/${ADMIN}/category`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaFolder className="me-2" /> Danh mục sản phẩm
//           </NavLink>
//         )}
//         {hasPermission("read_users") && (
//           <NavLink
//             to={`/${ADMIN}/user`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaUsers className="me-2" /> Quản lý khách hàng
//           </NavLink>
//         )}
//         {hasPermission("read_orders") && (
//           <NavLink
//             to={`/${ADMIN}/order`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaShoppingCart className="me-2" /> Quản lý đơn hàng
//           </NavLink>
//         )}
//         {hasPermission("read_reviews") && (
//           <NavLink
//             to={`/${ADMIN}/reviews`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaStar className="me-2" /> Quản lý đánh giá
//           </NavLink>
//         )}
//         {hasPermission("read_notifications") && (
//           <NavLink
//             to={`/${ADMIN}/notification`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaBell className="me-2" /> Quản lý thông báo
//           </NavLink>
//         )}
//         {hasPermission("read_accounts") && (
//           <NavLink
//             to={`/${ADMIN}/account`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaUserFriends className="me-2" /> Quản lý nhân sự
//           </NavLink>
//         )}
//         {hasPermission("read_roles") && (
//           <NavLink
//             to={`/${ADMIN}/role`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaUserShield className="me-2" /> Nhóm quyền
//           </NavLink>
//         )}
//         {hasPermission("roles_permissions") && (
//           <NavLink
//             to={`/${ADMIN}/role/permissions`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaUsers className="me-2" /> Phân quyền
//           </NavLink>
//         )}
//         {hasPermission("settings_view") && (
//           <NavLink
//             to={`/${ADMIN}/settings`}
//             className={({ isActive }) =>
//               `nav-link text-white ${isActive ? "bg-primary" : ""}`
//             }
//             end={true}
//           >
//             <FaCog className="me-2" /> Cài đặt
//           </NavLink>
//         )}
//       </Nav>
//     </div>
//   );
// };

// export default SiderComponent;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Alert,
  Spinner,
  Badge,
  Card,
} from "react-bootstrap";
import {
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiSettings,
  FiXCircle,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import orderService from "../../../services/client/orderService";
import authService from "../../../services/client/authService";
import OrderListComponent from "../../../components/client/order/OrderListComponent";
import SettingsFormComponent from "../../../components/client/user/SettingsFormComponent";
import RatedReviewsComponent from "../../../components/client/rating/RatedReviewsComponent";
import "../../../styles/client/pages/MyAccountPage.css";

const MyAccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, orderResponse] = await Promise.all([
          authService.getUserInfo(),
          orderService.getMyOrders(),
        ]);
        setUserInfo(userResponse.info);
        setOrders(orderResponse.orders);
      } catch (error) {
        setError(error.response?.data?.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const pending = orders.filter((order) => order.status === "pending");
  const delivered = orders.filter((order) => order.status === "delivered");
  const history = orders.filter((order) => order.status === "completed");
  const cancelled = orders.filter((order) => order.status === "cancelled");

  return (
    <Container fluid className="p-0">
      <Row className="account-row">
        <Col
          md={3}
          className="sidebar-col ms-0 ps-0"
          style={{ paddingTop: 0, marginTop: 0 }}
        >
          <ListGroup variant="flush" className="bg-dark">
            <ListGroup.Item
              action
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "pending" ? "custom-active" : ""
              }`}
            >
              <div className="d-flex align-items-center w-100">
                <div>
                  <FiCheckCircle className="me-2" /> Chờ xác nhận
                </div>
                {pending.length > 0 && (
                  <Badge bg="danger" pill className="ms-auto">
                    {pending.length}
                  </Badge>
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "delivered"}
              onClick={() => setActiveTab("delivered")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "delivered" ? "custom-active" : ""
              }`}
            >
              <div className="d-flex align-items-center w-100">
                <div>
                  <FiTruck className="me-2" /> Chờ giao hàng
                </div>
                {delivered.length > 0 && (
                  <Badge bg="danger" pill className="ms-auto">
                    {delivered.length}
                  </Badge>
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "history" ? "custom-active" : ""
              }`}
            >
              <FiClock className="me-2" /> Lịch sử mua hàng
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "cancelled"}
              onClick={() => setActiveTab("cancelled")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "cancelled" ? "custom-active" : ""
              }`}
            >
              <FiXCircle className="me-2" /> Đơn đã huỷ
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "rated-reviews"}
              onClick={() => setActiveTab("rated-reviews")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "rated-reviews" ? "custom-active" : ""
              }`}
            >
              <FaStar className="me-2" /> Đã đánh giá
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              className={`text-white bg-dark border-0 d-flex align-items-center ps-4 ${
                activeTab === "settings" ? "custom-active" : ""
              }`}
            >
              <FiSettings className="me-2" /> Cài đặt tài khoản
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9} className="pe-4">
          {activeTab === "pending" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiCheckCircle className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Chờ xác nhận</h2>
                </div>
              </Card.Header>
              <OrderListComponent orders={pending} />
            </Card>
          )}
          {activeTab === "delivered" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiTruck className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Chờ giao hàng</h2>
                </div>
              </Card.Header>
              <OrderListComponent orders={delivered} />
            </Card>
          )}
          {activeTab === "history" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiClock className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Lịch sử mua hàng</h2>
                </div>
              </Card.Header>
              <OrderListComponent orders={history} />
            </Card>
          )}
          {activeTab === "cancelled" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiXCircle className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Đơn đã huỷ</h2>
                </div>
              </Card.Header>
              <OrderListComponent orders={cancelled} />
            </Card>
          )}
          {activeTab === "settings" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiSettings className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Cài đặt tài khoản</h2>
                </div>
              </Card.Header>
              <SettingsFormComponent
                user={userInfo}
                setUserInfo={setUserInfo}
              />
            </Card>
          )}
          {activeTab === "rated-reviews" && <RatedReviewsComponent />}
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccountPage;
