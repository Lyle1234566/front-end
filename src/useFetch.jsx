import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { backend_server } from "./main";
import toast from "react-hot-toast";

const useFetch = (API_URL) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetched_data, setFetched_Data] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Add timeout to avoid hanging indefinitely
      const response = await axios.get(API_URL, { timeout: 15000 });

      setFetched_Data(response.data);
      setLoading(false);

      // http://localhost:5000/uploads/02e2af9df9c9a02234688a77241924f2 CORRECT

      // http://localhost:5000/uploads\bb367469a423603133b0c570eda20730

      // If response ma Image exists then handle it , else default value set or Undefined error aauxa
      if (response.data.data && response.data.data.image) {
        const imagePath = response.data.data.image;
        // Fix path construction to handle paths with or without leading slash
        const fullImagePath = `${backend_server}${
          imagePath.startsWith("/") ? "" : "/"
        }${imagePath}`;
        setImagePath(fullImagePath);
      } else {
        // Set a default or fallback value for imagePath
        setImagePath(`${backend_server}/uploads/default-book.jpg`);
      }

      // Old Code for Image
      // const imagePath = response.data.data.image
      // const fullImagePath = `${backend_server}/${imagePath}`
      // setImagePath(fullImagePath)
    } catch (error) {
      console.log("Fetch error:", error);

      // Handle different error scenarios
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. The server may be waking up.");
      } else if (error.response && error.response.status === 502) {
        setError(
          "Backend server is currently unavailable or spinning up. Please wait a moment."
        );
      } else if (error.response) {
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        setError("No response received. Check your network connection.");
      } else {
        setError("An error occurred while fetching data.");
      }

      // Set an empty result and default image
      setFetched_Data([]);
      setImagePath(`${backend_server}/uploads/default-book.jpg`);

      // Implement retry logic (max 3 retries)
      if (retryCount < 3) {
        const retryDelay = 2000 + retryCount * 1000; // Increasing delay
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      } else {
        setLoading(false);
        // Show toast only on final retry failure
        toast.error(
          "Backend server appears to be offline. Some features may not work correctly.",
          {
            duration: 4000,
            id: `fetch-error-${API_URL}`, // Prevent multiple identical toasts
          }
        );
      }
    }
  }, [API_URL, retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { fetched_data, loading, imagePath, error, refetch: fetchData };
};

export default useFetch;
