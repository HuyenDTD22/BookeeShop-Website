import React from "react";
import BookCardComponent from "./BookCardComponent";

const FeaturedBookComponent = ({ books }) => {
  return (
    <section className="featured-books mb-5">
      <div className="section-title">
        <h2 className="text-center mb-4">Featured Books</h2>
        <div className="divider mb-4"></div>
      </div>
      <div className="row">
        {books && books.length > 0 ? (
          books.map((book) => <BookCardComponent key={book._id} book={book} />)
        ) : (
          <div className="col-12 text-center">
            <p>No featured books available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBookComponent;
