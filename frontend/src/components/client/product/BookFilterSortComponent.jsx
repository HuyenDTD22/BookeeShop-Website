import React, { useState } from "react";
import { Form, Dropdown, Button } from "react-bootstrap";

const BookFilterSortComponent = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    rating: initialFilters.rating || "",
    sortBy: initialFilters.sortBy || "",
    sortOrder: initialFilters.sortOrder || "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="book-filter-sort mb-4">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        {/* Lọc theo sao */}
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Lọc theo sao:</Form.Label>
          <Form.Select
            style={{ width: "150px" }}
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </Form.Select>
        </Form.Group>

        {/* Sắp xếp */}
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-sort">
            {filters.sortBy
              ? `Sắp xếp: ${
                  filters.sortBy === "price"
                    ? `Giá ${
                        filters.sortOrder === "asc"
                          ? "thấp đến cao"
                          : "cao đến thấp"
                      }`
                    : filters.sortBy === "soldCount"
                    ? "Bán chạy"
                    : "Đánh giá cao"
                }`
              : "Sắp xếp"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                handleFilterChange("sortBy", "price");
                handleFilterChange("sortOrder", "asc");
              }}
            >
              Giá: Thấp đến cao
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleFilterChange("sortBy", "price");
                handleFilterChange("sortOrder", "desc");
              }}
            >
              Giá: Cao đến thấp
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleFilterChange("sortBy", "soldCount");
                handleFilterChange("sortOrder", "desc");
              }}
            >
              Bán chạy
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleFilterChange("sortBy", "rating_mean");
                handleFilterChange("sortOrder", "desc");
              }}
            >
              Đánh giá sao
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Reset filters */}
        <Button
          variant="outline-secondary"
          onClick={() => {
            const resetFilters = { rating: "", sortBy: "", sortOrder: "" };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default BookFilterSortComponent;
