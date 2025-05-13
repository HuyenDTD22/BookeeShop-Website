import React, { useState, useEffect } from "react";
import { Container, Row, Form, Button, Alert, Dropdown } from "react-bootstrap";
import OrderTableComponent from "../../../components/admin/order/OrderTableComponent";
import orderService from "../../../services/admin/orderService";
import PaginationComponent from "../../../components/common/PaginationComponent";
import "../../../styles/admin/pages/OrderPage.css";

const OrderPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const limitItems = 5;

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * limitItems;
    const endIndex = startIndex + limitItems;
    setDisplayedOrders(allOrders.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(allOrders.length / limitItems) || 1);
  }, [allOrders, currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders(filters);
      setAllOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAllOrders([]);
      setDisplayedOrders([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleStatusChange = (selectedStatus) => {
    setFilters((prev) => ({ ...prev, status: selectedStatus }));
    setCurrentPage(1);
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (!selectedOrders.length) {
      setError("Vui lòng chọn ít nhất một đơn hàng để thay đổi trạng thái!");
      return;
    }

    try {
      await orderService.ChangeMultiStatus(selectedOrders, newStatus);
      setSelectedOrders([]);
      fetchOrders();
      setError(null);
    } catch (err) {
      setError(
        err.message || "Đã xảy ra lỗi khi thay đổi trạng thái hàng loạt!"
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.ChangeStatus(orderId, newStatus);
      fetchOrders();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      fetchOrders();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="py-4">
      <h2>Quản lý đơn hàng</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <div className="d-flex align-items-end filter-row">
          <Form.Group className="filter-group" style={{ width: "150px" }}>
            <Form.Label className="filter-label">Trạng thái</Form.Label>
            <Dropdown onSelect={handleStatusChange}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-status">
                {filters.status || "Tất cả"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="">Tất cả</Dropdown.Item>
                <Dropdown.Item eventKey="pending">Chờ xác nhận</Dropdown.Item>
                <Dropdown.Item eventKey="delivered">
                  Đang giao hàng
                </Dropdown.Item>
                <Dropdown.Item eventKey="completed">
                  Đã hoàn thành
                </Dropdown.Item>
                <Dropdown.Item eventKey="cancelled">Đã hủy</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="filter-group" style={{ width: "150px" }}>
            <Form.Label className="filter-label">Hành động</Form.Label>
            <Dropdown onSelect={handleBulkStatusChange}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-action">
                {selectedOrders.length > 0
                  ? `Đã chọn ${selectedOrders.length} đơn hàng`
                  : "-- Chọn --"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="pending">Chờ xác nhận</Dropdown.Item>
                <Dropdown.Item eventKey="delivered">
                  Đang giao hàng
                </Dropdown.Item>
                <Dropdown.Item eventKey="completed">
                  Đã hoàn thành
                </Dropdown.Item>
                <Dropdown.Item eventKey="cancelled">Đã hủy</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="filter-group" style={{ width: "150px" }}>
            <Form.Label className="filter-label">Ngày bắt đầu</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form.Group className="filter-group" style={{ width: "150px" }}>
            <Form.Label className="filter-label">Ngày kết thúc</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form
            onSubmit={handleSearch}
            className="filter-group d-flex align-items-end flex-grow-1"
          >
            <Form.Group className="d-flex align-items-end">
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Tìm theo mã đơn hoặc tên khách hàng"
                style={{ minWidth: "150px", maxWidth: "300px" }}
              />
              <Button type="submit" variant="primary" className="ms-2">
                Tìm
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Row>

      {displayedOrders.length > 0 ? (
        <>
          <OrderTableComponent
            orders={displayedOrders}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onSelect={setSelectedOrders}
            selectedOrders={selectedOrders}
            currentPage={currentPage}
            limitItems={limitItems}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={allOrders.length}
            loading={false}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>Không có đơn hàng nào để hiển thị.</p>
      )}
    </Container>
  );
};

export default OrderPage;
