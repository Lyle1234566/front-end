import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export const backend_server = "https://back-end-c25l.onrender.com";

// Set up axios headers to help with CORS
axios.defaults.headers.common["Access-Control-Allow-Origin"] =
  "front-end-123.vercel.app";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Wrap App in a loading handler component
const AppWithLoading = () => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Make a direct GET request to actively wake up the server
        const response = await axios({
          method: "get",
          url: `${backend_server}/api/v1/books`,
          timeout: 30000, // Increased timeout to 30 seconds
          withCredentials: false,
        });

        console.log("Backend response:", response.status);
        setIsBackendReady(true);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.log("Backend check result:", error.message);

        // If we get any response, check if it's actually a 404 or other error
        if (error.response) {
          console.log(
            "Backend is accessible with status:",
            error.response.status
          );

          // If it's a 404, the endpoint might not exist
          if (error.response.status === 404) {
            setError("Backend endpoint not found. Please check your API URL.");
            setIsBackendReady(false);
          } else {
            // Other response codes might indicate the server is up
            setIsBackendReady(true);
            setError(null);
          }

          setIsLoading(false);
          return;
        }

        // Continue retrying more times (10 instead of 5)
        if (retryCount < 10) {
          setError(`Backend not ready yet. Retrying... (${retryCount + 1}/11)`);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 5000); // Increased delay to 5 seconds
        } else {
          // After maximum retries, show error but allow app to continue
          setError(
            "Could not connect to backend server. Some features may not work."
          );
          setIsLoading(false);
        }
      }
    };

    checkBackendStatus();
  }, [retryCount]);

  // Add a periodic check to try connecting to backend even after app has loaded
  useEffect(() => {
    if (!isLoading && !isBackendReady) {
      const interval = setInterval(() => {
        axios({
          method: "get",
          url: `${backend_server}/api/v1/books`,
          timeout: 10000,
          withCredentials: false,
        })
          .then(() => {
            setIsBackendReady(true);
            setError(null);
            clearInterval(interval);
          })
          .catch((err) => {
            if (err.response && err.response.status !== 404) {
              setIsBackendReady(true);
              setError(null);
              clearInterval(interval);
            }
          });
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading, isBackendReady]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Waking up the server...</h3>
        <p className="text-muted">
          This may take up to 60 seconds as our server is spinning up on Render.
        </p>
        <p className="text-muted small">Attempt {retryCount + 1} of 11</p>
        {error && <p className="text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <App backendReady={isBackendReady} />
    </>
  );
};

// Create root only once to prevent multiple createRoot() calls
const rootElement = document.getElementById("root");
// Ensure we don't try to render if there's no root element
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<AppWithLoading />);
}
// <React.StrictMode>
// </React.StrictMode>
