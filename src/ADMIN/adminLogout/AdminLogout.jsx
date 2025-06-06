import React from "react";
import { backend_server } from "../../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../../LoginState";

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`;
  const navigate = useNavigate();
  const userLoginState = useLoginState();

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.clear();
      // Reset login state
      userLoginState.logout();
      // Clear cookie using API
      await axios.post(logout_Api_url);
      // Redirect to books discovery page
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <img
            className="img-fluid"
            src="/LogoutImage.jpg"
            alt=""
            style={{ width: "350px" }}
          />
          <h3 className="h3">Are you sure you want to logout?</h3>
          <button className="btn btn-success mx-5 my-3" onClick={handleLogout}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogout;
