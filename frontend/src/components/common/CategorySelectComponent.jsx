import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import SelectTreeComponent from "./SelectTreeComponent";
import { getCategory } from "../../services/admin/categoryService";

const CategorySelectComponent = ({
  value,
  onChange,
  name = "book_category_id",
  label = "Danh mục",
  className = "shadow-sm",
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <Form.Select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={className}
      >
        <option value="">-- Chọn danh mục --</option>
        <SelectTreeComponent items={categories} />
      </Form.Select>
    </Form.Group>
  );
};

export default CategorySelectComponent;
