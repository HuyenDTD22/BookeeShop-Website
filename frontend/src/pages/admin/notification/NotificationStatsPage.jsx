import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import notificationService from "../../../services/admin/notificationService";
import { AuthContext } from "../../../context/AuthContext";

const NotificationStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await notificationService.getNotificationStats();
        setStats(response.data);
      } catch (error) {
        alert("Lấy thống kê thông báo thất bại!");
      } finally {
        setLoading(false);
      }
    };

    if (hasPermission("stats_notifications")) {
      fetchStats();
    }
  }, []);

  if (!hasPermission("stats_notifications")) {
    return <Container>Không có quyền truy cập.</Container>;
  }

  if (loading) {
    return (
      <Container>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!stats) {
    return <Container>Không có dữ liệu thống kê.</Container>;
  }

  return (
    <Container>
      <h1 className="fs-3 mb-4">Thống kê thông báo</h1>
      <Table bordered>
        <tbody>
          <tr>
            <td>
              <strong>Tỷ lệ đọc</strong>
            </td>
            <td>{stats.readRate.toFixed(2)}%</td>
          </tr>
        </tbody>
      </Table>

      <h3 className="fs-4 mt-4">Số lượng theo loại</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Loại</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {stats.byType.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="fs-4 mt-4">Số lượng theo trạng thái</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Trạng thái</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {stats.byStatus.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default NotificationStatsPage;
