import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Collapse,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import dashboardService from "../../../services/admin/dashboardService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Bản đồ trạng thái đơn hàng từ tiếng Anh sang tiếng Việt
const statusMap = {
  pending: "Chờ xác nhận",
  delivered: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-05-11");
  const [openPending, setOpenPending] = useState(false);
  const [openLowStock, setOpenLowStock] = useState(false);

  // Lấy dữ liệu dashboard
  const fetchStats = async (params = {}) => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats(params);
      if (response.success) {
        // Chuyển đổi trạng thái đơn hàng sang tiếng Việt
        const updatedStats = {
          ...response.data,
          charts: {
            ...response.data.charts,
            orderStatus: response.data.charts.orderStatus.map((item) => ({
              ...item,
              status: statusMap[item.status] || item.status,
            })),
          },
        };
        setStats(updatedStats);
        setError(null);
      } else {
        setError("Không thể lấy dữ liệu dashboard");
      }
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount và khi thay đổi params
  useEffect(() => {
    fetchStats({ startDate, endDate });
  }, []);

  // Xử lý lọc thời gian
  const handleFilter = () => {
    fetchStats({ startDate, endDate });
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log("Đăng xuất");
    // Xử lý đăng xuất (xóa token, chuyển hướng)
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <div>Không có dữ liệu</div>;

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Tổng quan</h2>

      {/* Bộ lọc thời gian */}
      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button variant="primary" onClick={handleFilter}>
              Lọc
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Thẻ chỉ số */}
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Doanh thu</Card.Title>
              <Card.Text className="fs-4">
                {stats.metrics.revenue.toLocaleString()} VNĐ
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Người dùng mới</Card.Title>
              <Card.Text className="fs-4">{stats.metrics.newUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Tổng đơn hàng</Card.Title>
              <Card.Text className="fs-4">
                {stats.metrics.orders.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Sách trong kho</Card.Title>
              <Card.Text className="fs-4">
                {stats.metrics.books.inStock}/{stats.metrics.books.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Danh mục</Card.Title>
              <Card.Text className="fs-4">{stats.metrics.categories}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Đánh giá</Card.Title>
              <Card.Text className="fs-4">{stats.metrics.ratings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Nhân viên</Card.Title>
              <Card.Text className="fs-4">{stats.metrics.admins}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Thông báo</Card.Title>
              <Card.Text className="fs-4">
                {stats.metrics.notifications.total} (Đọc:{" "}
                {stats.metrics.notifications.readRate}%)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Doanh thu theo ngày</Card.Title>
              <LineChart width={500} height={300} data={stats.charts.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Người dùng mới theo ngày</Card.Title>
              <LineChart width={500} height={300} data={stats.charts.users}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Trạng thái đơn hàng</Card.Title>
              <PieChart width={500} height={300}>
                <Pie
                  data={stats.charts.orderStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {stats.charts.orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Top sách bán chạy</Card.Title>
              <BarChart width={500} height={300} data={stats.charts.topBooks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#8884d8" />
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cảnh báo */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Cảnh báo</Card.Title>
              {stats.alerts.pendingOrders.count > 0 && (
                <div className="mb-2">
                  <Alert
                    variant="warning"
                    className="d-flex align-items-center justify-content-between"
                  >
                    <span>
                      Có {stats.alerts.pendingOrders.count} đơn hàng đang chờ xử
                      lý quá 24 giờ.
                    </span>
                    <Button
                      variant="link"
                      onClick={() => setOpenPending(!openPending)}
                      aria-controls="pending-orders-collapse"
                      aria-expanded={openPending}
                      className="p-0"
                    >
                      {openPending ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                  </Alert>
                  <Collapse in={openPending}>
                    <div id="pending-orders-collapse">
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>ID Đơn hàng</th>
                            <th>Tên khách hàng</th>
                            <th>Ngày tạo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.alerts.pendingOrders.list.map((order) => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.userName}</td>
                              <td>
                                {new Date(order.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Collapse>
                </div>
              )}
              {stats.alerts.lowStockBooks.count > 0 && (
                <div className="mb-2">
                  <Alert
                    variant="danger"
                    className="d-flex align-items-center justify-content-between"
                  >
                    <span>
                      Có {stats.alerts.lowStockBooks.count} sách tồn kho thấp
                      (dưới 10).
                    </span>
                    <Button
                      variant="link"
                      onClick={() => setOpenLowStock(!openLowStock)}
                      aria-controls="low-stock-books-collapse"
                      aria-expanded={openLowStock}
                      className="p-0"
                    >
                      {openLowStock ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                  </Alert>
                  <Collapse in={openLowStock}>
                    <div id="low-stock-books-collapse">
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Tên sách</th>
                            <th>Tồn kho</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.alerts.lowStockBooks.list.map(
                            (book, index) => (
                              <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.stock}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Collapse>
                </div>
              )}
              {stats.alerts.lowReadNotifications > 0 && (
                <Alert variant="info">
                  Có {stats.alerts.lowReadNotifications} thông báo có tỷ lệ đọc
                  thấp (dưới 50%).
                </Alert>
              )}
              {stats.alerts.pendingOrders.count === 0 &&
                stats.alerts.lowStockBooks.count === 0 &&
                stats.alerts.lowReadNotifications === 0 && (
                  <Alert variant="success">Không có cảnh báo nào!</Alert>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Thông báo gần đây */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Thông báo gần đây</Card.Title>
              {stats.recentNotifications.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tiêu đề</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th>Ngày gửi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentNotifications.map((notification) => (
                      <tr key={notification._id}>
                        <td>{notification.title}</td>
                        <td>{notification.type}</td>
                        <td>{notification.status}</td>
                        <td>
                          {new Date(notification.sendAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Không có thông báo gần đây.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
