import React, { useState } from "react";
import { Table, Button, Image } from "react-bootstrap";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const CartItemComponent = ({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  onSelect,
  isSelected,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const navigate = useNavigate();

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(item.book_id, newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    onUpdateQuantity(item.book_id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.book_id);
  };

  const handleBuyNow = () => {
    navigate("/order", { state: { cart: [item], total: item.totalPrice } });
  };

  const handleCheckboxChange = () => {
    onSelect(item.book_id);
  };

  const defaultImage = "https://via.placeholder.com/100?text=No+Image";
  const imageSrc = item.bookInfo?.thumbnail || defaultImage;

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </td>
      <td>{index}</td>
      <td>
        <Link
          to={`/book/detail/${item.bookInfo?.slug}`}
          className="text-decoration-none"
        >
          <div className="d-flex align-items-center">
            <Image
              src={imageSrc}
              alt={item.bookInfo?.title || "Sản phẩm"}
              style={{ width: "100px", height: "100px", marginRight: "20px" }}
              thumbnail
            />
            <div>
              <p className="mb-1" style={{ color: "#000000" }}>
                {item.bookInfo?.title || "Không có tiêu đề"}
              </p>
              <p className="mb-1" style={{ color: "#000000" }}>
                Giá: {(item.bookInfo?.priceNew || 0).toLocaleString("vi-VN")}{" "}
                VNĐ{" "}
                <span
                  className="text-muted"
                  style={{ textDecoration: "line-through" }}
                >
                  {(item.bookInfo?.price || 0).toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
            </div>
          </div>
        </Link>
      </td>
      <td>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <Button variant="outline-secondary" onClick={handleDecrease}>
            -
          </Button>
          <span>{quantity}</span>
          <Button variant="outline-secondary" onClick={handleIncrease}>
            +
          </Button>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <Button variant="danger" size="sm" onClick={handleRemove}>
            <FaTrash />
          </Button>
          <Button variant="success" size="sm" onClick={handleBuyNow}>
            <FaShoppingCart /> Mua ngay
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CartItemComponent;
