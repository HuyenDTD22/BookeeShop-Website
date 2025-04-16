import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const BookCardComponent = ({ book }) => {
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa fa-star ${
            i < roundedRating ? "text-warning" : "text-muted"
          }`}
        >
          <FontAwesomeIcon icon={faStar} />
        </i>
      );
    }

    return stars;
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="bbb_deals">
        {book.discountPercentage > 0 && (
          <div className="ribbon ribbon-top-right">
            <span>
              <small className="cross">x </small>
              {book.discountPercentage}%
            </span>
          </div>
        )}
        <div className="bbb_deals_title">
          {book.feature === "1" ? "Featured" : "New Arrival"}
        </div>
        <div className="bbb_deals_slider_container">
          <div className="bbb_deals_item">
            <div className="bbb_deals_image">
              <img
                src={
                  book.thumbnail ||
                  "https://via.placeholder.com/300x400?text=Book+Cover"
                }
                alt={book.title}
              />
            </div>
            <div className="bbb_deals_content">
              <div className="bbb_deals_info_line d-flex flex-row justify-content-start">
                <div className="bbb_deals_item_category">
                  <Link to={`/book/${book.category?.slug || ""}`}>
                    {book.category?.title || "Uncategorized"}
                  </Link>
                </div>
                {book.discountPercentage > 0 && (
                  <div className="bbb_deals_item_price_a ml-auto">
                    <strike>${book.price.toFixed(2)}</strike>
                  </div>
                )}
              </div>
              <div className="bbb_deals_info_line d-flex flex-row justify-content-start">
                <div className="bbb_deals_item_name">
                  <Link to={`/book/detail/${book.slug}`} className="text-dark">
                    {book.title}
                  </Link>
                </div>
                <div className="bbb_deals_item_price ml-auto">
                  ${book.priceNew?.toFixed(2) || book.price.toFixed(2)}
                </div>
              </div>
              <div className="available">
                <div className="available_line d-flex flex-row justify-content-start">
                  <div className="available_title">
                    Available: <span>{book.stock}</span>
                  </div>
                  <div className="sold_stars ml-auto">
                    {renderStars(book.rating_mean)}
                  </div>
                </div>
                <div className="available_bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        (book.purchase_count /
                          (book.purchase_count + book.stock)) *
                          100
                      )}%`,
                    }}
                  ></span>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  to={`/book/detail/${book.slug}`}
                  className="btn btn-sm btn-primary"
                >
                  Details
                </Link>
                <button className="btn btn-sm btn-success ml-2">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCardComponent;
