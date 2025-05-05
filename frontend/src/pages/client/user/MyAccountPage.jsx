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
import { FiCheckCircle, FiTruck, FiClock, FiSettings } from "react-icons/fi";
import orderService from "../../../services/client/orderService";
import authService from "../../../services/client/authService";
import OrderListComponent from "../../../components/client/checkout/OrderListComponent";
import SettingsFormComponent from "../../../components/client/user/SettingsFormComponent";
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
  const history = orders.filter((order) =>
    ["completed", "cancelled"].includes(order.status)
  );

  return (
    <Container fluid className="p-0">
      <Row>
        <Col
          md={3}
          className="ms-0 ps-0"
          style={{ paddingTop: 0, marginTop: 0 }}
        >
          <ListGroup
            variant="flush"
            className="bg-dark"
            style={{ minHeight: "calc(100vh - 100px)" }} // Giả sử header + footer ~100px
          >
            <ListGroup.Item
              action
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
              className={`text-white bg-dark border-0 d-flex align-items-center ${
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
              className={`text-white bg-dark border-0 d-flex align-items-center ${
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
              className={`text-white bg-dark border-0 d-flex align-items-center ${
                activeTab === "history" ? "custom-active" : ""
              }`}
            >
              <FiClock className="me-2" /> Lịch sử mua hàng
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              className={`text-white bg-dark border-0 d-flex align-items-center ${
                activeTab === "settings" ? "custom-active" : ""
              }`}
            >
              <FiSettings className="me-2" /> Cài đặt
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
          {activeTab === "settings" && (
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FiSettings className="me-2" size={24} />
                  <h2 className="m-0 fs-4">Cài đặt</h2>
                </div>
              </Card.Header>
              <SettingsFormComponent
                user={userInfo}
                setUserInfo={setUserInfo}
              />
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccountPage;
