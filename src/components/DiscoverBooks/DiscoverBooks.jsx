import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_server } from "../../main";
import BookCard from "../BookCard/BookCard";
import "./DiscoverBooks.css";

const DiscoverBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backend_server}/api/v1/recentBooks`
        );
        setBooks(response.data.books || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again later.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="discover-container">
      <div className="discover-hero">
        <h1>Discover new worlds</h1>
        <p>
          Dive into captivating stories. Immerse yourself in a world of
          imagination and wonders.
        </p>
      </div>

      <div className="latest-books">
        <h2>Latest Books</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverBooks;
