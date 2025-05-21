import React, { useState } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";

const FilterBarComponent = ({ onFilter, onSearch, onAddNew }) => {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
    onFilter({ status: selectedStatus });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <div className="filter-bar d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-status">
            {status || "Trạng thái"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleStatusChange("")}>
              Tất cả
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("active")}>
              Hoạt động
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("inactive")}>
              Dừng hoạt động
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* <Dropdown style={{ marginLeft: "15px" }}>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-status">
            {status || "Sắp xếp"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleStatusChange("")}>
              Tất cả
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("active")}>
              Hoạt động
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("inactive")}>
              Dừng hoạt động
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <Form className="ms-3" onSubmit={handleSearch}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Nhập từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <Button type="submit" variant="primary" className="ms-2">
              Tìm
            </Button>
          </Form.Group>
        </Form>
      </div>

      <Button variant="success" onClick={onAddNew}>
        + Thêm mới
      </Button>
    </div>
  );
};

export default FilterBarComponent;
