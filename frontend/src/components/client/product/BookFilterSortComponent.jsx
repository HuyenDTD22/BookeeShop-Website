import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const BookFilterSortComponent = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    rating: initialFilters.rating || "",
    sortBy: initialFilters.sortBy || "",
    sortOrder: initialFilters.sortOrder || "",
  });

  // Đồng bộ filters với initialFilters
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key, value, additionalUpdates = {}) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [key]: value, ...additionalUpdates };
      if (key === "sortBy" && value && !newFilters.sortOrder) {
        newFilters.sortOrder = "asc";
      }
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="book-filter-sort mb-4">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        {/* Cột lọc theo sao */}
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

        {/* Cột sắp xếp */}
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Sắp xếp:</Form.Label>
          <Form.Select
            style={{ width: "200px" }}
            value={
              filters.sortBy ? `${filters.sortBy}_${filters.sortOrder}` : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              console.log("Sort select changed:", value);
              if (value === "") {
                handleFilterChange("sortBy", "", { sortOrder: "" });
              } else {
                // Xử lý đặc biệt cho rating_mean_desc
                if (value === "rating_mean_desc") {
                  handleFilterChange("sortBy", "rating_mean", {
                    sortOrder: "desc",
                  });
                } else {
                  const [sortBy, sortOrder] = value.split("_");
                  handleFilterChange("sortBy", sortBy, { sortOrder });
                }
              }
            }}
          >
            <option value="">Chọn tiêu chí</option>
            <option value="priceNew_asc">Giá: Thấp đến cao</option>
            <option value="priceNew_desc">Giá: Cao đến thấp</option>
            <option value="soldCount_desc">Bán chạy</option>
            <option value="rating_mean_desc">Đánh giá cao</option>
          </Form.Select>
        </Form.Group>

        {/* Reset filters */}
        <Button
          variant="outline-secondary"
          onClick={() => {
            const resetFilters = { rating: "", sortBy: "", sortOrder: "" };
            setFilters(resetFilters);
            console.log("Reset filters:", resetFilters);
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
