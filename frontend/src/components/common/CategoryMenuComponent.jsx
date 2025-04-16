import React from "react";
import { Link } from "react-router-dom";

const CategoryMenuComponent = ({ categories }) => {
  // Recursive function to render categories and subcategories
  const renderCategories = (cats, level = 0) => {
    return cats.map((category) => (
      <div key={category._id} className={`category-item level-${level}`}>
        <Link
          to={`/book/${category.slug}`}
          className="d-block p-2 text-decoration-none"
          style={{ paddingLeft: `${level * 15 + 10}px` }}
        >
          {category.title}
        </Link>
        {category.children && category.children.length > 0 && (
          <div className="subcategories">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="category-menu card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Book Categories</h5>
      </div>
      <div className="card-body p-0">
        {categories && categories.length > 0 ? (
          <div className="category-list">{renderCategories(categories)}</div>
        ) : (
          <p className="p-3">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default CategoryMenuComponent;
