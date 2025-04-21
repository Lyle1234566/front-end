import React, { useEffect, useState } from "react";
import { backend_server } from "../../main";
import axios from "axios";
import { Link } from "react-router-dom";
import RequestBook from "../requestBooks/RequestBook";
import { Toaster } from "react-hot-toast";
import { useLoginState } from "../../LoginState";

const RecommendedBooks = () => {
  const RECOMMENDED_BOOK_API = `${backend_server}/api/v1/recommendedBooks`;

  const [latestBooks, setLatestBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userLogState } = useLoginState();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch data regardless of login state
      const response = await axios.get(RECOMMENDED_BOOK_API);
      const fetchedBooks = await response.data.data;
      setLatestBooks(fetchedBooks);
      setError(null);
    } catch (error) {
      console.log("Recommended Books Unable to Fetch");
      setError("Unable to fetch recommended books");
    } finally {
      setIsLoading(false);
    }
  };

  const { request_Book } = RequestBook();

  useEffect(() => {
    fetchData();
  }, [userLogState]);

  if (isLoading) {
    return (
      <div className="row my-2">
        <p className="p text-center">Loading recommended books...</p>
      </div>
    );
  }

  return (
    <div className="row my-2">
      {latestBooks.length > 0 ? (
        <div>
          <h1 className="h1 mt-3" style={{ textAlign: "center" }}>
            Recommended Books
          </h1>

          <div className="row mb-3">
            {latestBooks.length > 0 ? (
              latestBooks.map((book) => {
                const { _id, title, image, author, available } = book;
                const imgSrc = image
                  ? `${backend_server}${
                      image.startsWith("/") ? "" : "/"
                    }${image}`
                  : `${backend_server}/uploads/default-book.jpg`;

                return (
                  <div
                    className="col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6 gy-3"
                    key={_id}
                  >
                    <div className="card h-100">
                      <div className="card-img-top">
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                          className="img-fluid"
                          src={imgSrc}
                          alt={title || "Book image"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${backend_server}/uploads/default-book.jpg`;
                          }}
                        />
                      </div>

                      <div className="card-body">
                        <h5 className="h5 card-title">{title}</h5>
                        <p className="p card-text">{author}</p>
                        <div className="form-group mb-2 justify-content-center d-flex">
                          {/* Request Books Button */}
                          {available ? (
                            <button
                              type="button"
                              className="btn btn-primary me-2"
                              onClick={() => request_Book(_id)}
                            >
                              Request
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary me-2"
                              disabled
                            >
                              Out of Stock
                            </button>
                          )}

                          {/* View Books Button */}
                          <Link to={`/books/${_id}`}>
                            <button
                              type="button"
                              className="btn btn-secondary me-2"
                            >
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p text-center">No recommended books available</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecommendedBooks;
