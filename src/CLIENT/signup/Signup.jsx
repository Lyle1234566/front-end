import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { backend_server } from "../../main";

const Signup = () => {
  const API_URL = `${backend_server}/api/v1/signup`;

  const refUsername = useRef(null);

  const Empty_Form_Field = {
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  };

  const navigate = useNavigate();

  const [textField, setTextField] = useState(Empty_Form_Field);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State variable to track password visibility

  const showLoadingToast = () => {
    return toast.loading("Registering User...", {
      position: "top-center",
      duration: Infinity, // The toast will not automatically close
    });
  };

  const HandleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let loadingToastId = null;

    try {
      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
      const isValid = emailRegex.test(textField.email);

      if (!isValid) {
        setLoading(false);
        return toast.error("Invalid Email Format");
      }

      // Validate alphanumeric password with a must Special character
      const alphanumericRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      const isPasswordValid = alphanumericRegex.test(textField.password);
      if (!isPasswordValid) {
        setLoading(false);
        return toast.error(
          "Password must be alphanumeric and contain at least one special character"
        );
      }

      if (textField.password !== textField.confirm_password) {
        setLoading(false);
        return toast.error("Password doesnt match");
      }

      loadingToastId = showLoadingToast();

      const username = textField.username;
      const email = textField.email;
      const phone = textField.phone;
      const password = textField.password;

      const response = await axios.post(API_URL, {
        username,
        email,
        phone,
        password,
      });

      toast.dismiss(loadingToastId);
      setTextField(Empty_Form_Field);
      setLoading(false);

      if (response.data.GOTO_LOGIN === true) {
        toast.success("Account already exists. Please login.");
        navigate("/login", { replace: true });
      } else if (response.data.ENTER_OTP === true) {
        toast.success("Account created! Please verify with OTP.");
        navigate("/otp", { replace: true });
      } else {
        toast.success("Account created successfully!");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      if (loadingToastId) toast.dismiss(loadingToastId);
      setLoading(false);

      console.error("Signup error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    }
  };

  const HandleOnChange = (event) => {
    const field_name = event.target.name;
    const field_value = event.target.value;

    setTextField({ ...textField, [field_name]: field_value });
  };

  useEffect(() => {
    refUsername.current.focus();
  }, []);

  return (
    <div className="signup-maindiv">
      {/* TOP DIV */}
      <div className="signup-upperdiv">
        <h1>SignUp</h1>
      </div>

      {/* MIDDLE DIV */}
      <div className="signup-middlediv">
        <form onSubmit={HandleFormSubmit} method="post">
          <div className="first-row-form">
            <div className="username-field-div">
              <label htmlFor="usernamefield">Username : </label>
              <input
                type="text"
                placeholder="Enter name.."
                id="usernamefield"
                value={textField.username}
                onChange={HandleOnChange}
                name="username"
                autoComplete="off"
                required
                ref={refUsername}
                maxLength="20"
                minLength="5"
              />
            </div>

            <div className="email-field-div">
              <label htmlFor="emailfield">Email : </label>
              <input
                type="email"
                placeholder="e.g. user@gmail.com"
                id="emailfield"
                value={textField.email}
                onChange={HandleOnChange}
                name="email"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <label htmlFor="phonefield">Phone No. : </label>
          <input
            type="text"
            placeholder="e.g. 98..."
            id="phonefield"
            value={textField.phone}
            onChange={HandleOnChange}
            name="phone"
            autoComplete="off"
            required
            pattern="9\d{9}"
            minLength="10"
            maxLength="10"
          />

          <div className="password-main-div">
            <div className="password-div-first">
              <label htmlFor="passwordfield">Password : </label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  placeholder="Enter Password"
                  id="passwordfield"
                  value={textField.password}
                  onChange={HandleOnChange}
                  name="password"
                  autoComplete="off"
                  required
                  minLength="5"
                />
                <span style={{ visibility: "hidden" }}>
                  <BsEyeSlash />
                </span>
              </div>
            </div>

            <div className="password-div-second">
              <label htmlFor="passwordfield2">Confirm Password : </label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  placeholder="Confirm Password"
                  id="passwordfield2"
                  value={textField.confirm_password}
                  onChange={HandleOnChange}
                  name="confirm_password"
                  autoComplete="off"
                  required
                  minLength="5"
                />
                <span
                  onClick={() =>
                    setShowPassword((prevShowPassword) => !prevShowPassword)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              </div>
            </div>
          </div>

          <br />

          <button disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* LOWER DIV */}
      <div className="signup-lowerdiv">
        <p>Already have an Account? </p>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
