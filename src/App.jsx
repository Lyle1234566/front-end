import React, { useState, useEffect } from "react";
import ClientApp from "./CLIENT/ClientApp";
import AdminAPP from "./ADMIN/AdminAPP";
import { backend_server } from "./main";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// conditionally rendering home page based on user Role/Type
const App = ({ backendReady }) => {
  const UPDATE_BOOK_FINE = `${backend_server}/api/v1/checkbookreturn`;

  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateBookCharges = async () => {
    if (!backendReady) return;

    try {
      setIsLoading(true);
      // hits api endpoints that runs book fine charge if not returned
      const response = await axios.get(UPDATE_BOOK_FINE);
      // console.log(response.data.message)
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating book charges:", error);
      setIsLoading(false);
      // Don't show error toast as it might confuse users on first load
    }
  };

  useEffect(() => {
    if (backendReady) {
      updateBookCharges();
    }
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, [backendReady]);

  // Show toast notification if backend is experiencing issues
  useEffect(() => {
    if (backendReady === false) {
      toast.error(
        "The backend server may still be waking up. Some features may not work correctly yet.",
        { duration: 5000 }
      );
    }
  }, [backendReady]);

  return (
    <React.Fragment>
      <Toaster />
      {!backendReady && (
        <div
          className="position-fixed top-0 start-0 end-0 bg-warning text-dark p-2 text-center"
          style={{ zIndex: 1050 }}
        >
          Backend server is still warming up. Please wait a moment or refresh
          the page.
        </div>
      )}
      {userType === "admin_user" ? <AdminAPP /> : <ClientApp />}
    </React.Fragment>
  );
};

export default App;
