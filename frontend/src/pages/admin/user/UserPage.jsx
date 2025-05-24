import React, { useState, useEffect } from "react";
import { Container, Row, Form, Button, Alert, Dropdown } from "react-bootstrap";
import UserTableComponent from "../../../components/admin/user/UserTableComponent";
import userService from "../../../services/admin/userService";
import PaginationComponent from "../../../components/common/PaginationComponent";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const limitItems = 10;

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * limitItems;
    const endIndex = startIndex + limitItems;
    setDisplayedUsers(users.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(users.length / limitItems) || 1);
  }, [users, currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUsers([]);
      setDisplayedUsers([]);
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
    if (!selectedUsers.length) {
      setError("Vui lòng chọn ít nhất một khách hàng để thay đổi trạng thái!");
      return;
    }

    try {
      await userService.changeMultiStatus(selectedUsers, newStatus);
      setSelectedUsers([]);
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(
        err.message || "Đã xảy ra lỗi khi thay đổi trạng thái hàng loạt!"
      );
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await userService.changeStatus(userId, newStatus);
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      fetchUsers();
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
      <h2>Quản lý khách hàng</h2>
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
                <Dropdown.Item eventKey="active">Hoạt động</Dropdown.Item>
                <Dropdown.Item eventKey="inactive">
                  Không hoạt động
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="filter-group" style={{ width: "150px" }}>
            <Form.Label className="filter-label">Hành động</Form.Label>
            <Dropdown onSelect={handleBulkStatusChange}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-action">
                {selectedUsers.length > 0
                  ? `Đã chọn ${selectedUsers.length} khách hàng`
                  : "-- Chọn --"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="active">Hoạt động</Dropdown.Item>
                <Dropdown.Item eventKey="inactive">
                  Không hoạt động
                </Dropdown.Item>
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
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="filter-group d-flex align-items-end flex-grow-1"
          >
            <Form.Group className="d-flex align-items-end">
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Tìm theo tên hoặc email"
                style={{ minWidth: "150px", maxWidth: "300px" }}
              />
              <Button type="submit" variant="primary" className="ms-2">
                Tìm
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Row>

      {displayedUsers.length > 0 ? (
        <>
          <UserTableComponent
            users={displayedUsers}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onSelect={setSelectedUsers}
            selectedUsers={selectedUsers}
            currentPage={currentPage}
            limitItems={limitItems}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={users.length}
            loading={false}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>Không có khách hàng nào để hiển thị.</p>
      )}
    </Container>
  );
};

export default UserPage;
