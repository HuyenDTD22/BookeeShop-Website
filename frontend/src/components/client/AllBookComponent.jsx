import React, { useState, useEffect } from "react";
import bookService from "../../services/client/bookService";
import BookCardComponent from "./BookCardComponent";
import PaginationComponent from "../common/PaginationComponent";

const AllBookComponent = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks(currentPage, booksPerPage);

        // Assuming the API returns { books: [], totalItems: number }
        // If your API returns a different structure, adjust accordingly
        setBooks(data.books || data);

        // Calculate total pages if API provides total count
        if (data.totalItems) {
          setTotalPages(Math.ceil(data.totalItems / booksPerPage));
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo(0, document.querySelector(".all-books").offsetTop - 100);
  };

  if (loading) {
    return (
      <section className="all-books mb-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading books...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="all-books mb-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="all-books mb-5">
      <div className="section-title">
        <h2 className="text-center mb-4">All Books</h2>
        <div className="divider mb-4"></div>
      </div>

      <div className="row">
        {books && books.length > 0 ? (
          books.map((book) => <BookCardComponent key={book._id} book={book} />)
        ) : (
          <div className="col-12 text-center">
            <p>No books available at the moment.</p>
          </div>
        )}
      </div>

      {books && books.length > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default AllBookComponent;
