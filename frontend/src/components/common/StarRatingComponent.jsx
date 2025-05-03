import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRatingComponent = ({ rating, size = "1.5rem" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-flex align-items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} size={size} color="#FFD700" />
      ))}
      {hasHalfStar && <FaStarHalfAlt size={size} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} size={size} color="#FFD700" />
      ))}
      <span className="ms-2">({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRatingComponent;
