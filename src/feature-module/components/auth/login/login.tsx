import { Link } from "react-router";
import { useState } from "react";

import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import api from "../../../../lib/api";
import { saveAuth } from "../../../../lib/authHelper";

import "./login.css";

const handleSubmit = async (event: any) => {
  // No refresh on submit
  event.preventDefault();

  // Get form fields
  const username = event.target.username.value;
  const password = event.target.password.value;

  try {
    const response = await api.post("/auth/login", {
      email: username,
      password,
    });
    console.log("Login successful:", response.data);

    // Save authentication data
    if (response.data.token && response.data.user) {
      saveAuth(response.data);
      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    }
  } catch (error) {
    console.error("Login failed:", error);
    // Handle login error (show error message to user)
  }
};

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  return (
    <>
      {/* Start Content */}
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          {/* start row */}
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
            <div className="col-lg-4 mx-auto">
              <form
                className="d-flex justify-content-center align-items-center"
                onSubmit={handleSubmit}
              >
                <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                  <div className=" mx-auto mb-4 text-center w-25 h-25">
                    <ImageWithBasePath
                      src="assets/img/logo2.png"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </div>
                  <div className="card border-1 p-lg-3 shadow-md rounded-3 mb-4">
                    <div className="card-body login-card">
                      <div className="text-center mb-3">
                        <h5 className="mb-1 fs-20 fw-bold">Sign In</h5>
                        {/* <p className="mb-0">
                          Please enter below details to access the dashboard
                        </p> */}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text border-end-0 bg-white">
                            <i className="ti ti-mail fs-14 text-dark" />
                          </span>
                          <input
                            type="text"
                            name="username"
                            className="form-control border-start-0 ps-0"
                            placeholder="Enter Email Address"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="position-relative">
                          <div className="pass-group input-group position-relative border rounded">
                            <span className="input-group-text bg-white border-0">
                              <i className="ti ti-lock text-dark fs-14" />
                            </span>
                            <input
                              name="password"
                              type={passwordVisibility ? "password" : "text"}
                              className="pass-input form-control ps-0 border-0"
                              placeholder="****************"
                            />
                            <span className="input-group-text bg-white border-0">
                              <i
                                className={`ti toggle-password ti-eye${
                                  passwordVisibility ? "-off" : ""
                                } text-dark fs-14`}
                                onClick={togglePasswordVisibility}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="form-check form-check-md mb-0">
                            <input
                              className="form-check-input"
                              id="remember_me"
                              type="checkbox"
                            />
                            <label
                              htmlFor="remember_me"
                              className="form-check-label mt-0 text-dark"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <div className="text-end">
                          <Link
                            to={all_routes.forgotpasswordbasic}
                            className="text-danger"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className="mb-2">
                        <button type="submit" className="btn btn-primary w-100">
                          Login
                        </button>
                      </div>
                      {/* <div className="login-or position-relative mb-3">
                        <span className="span-or">OR</span>
                      </div> */}
                      {/* <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-center flex-wrap">
                          <div className="text-center me-2 flex-fill">
                            <Link
                              to="#"
                              className="br-10 p-1 btn btn-outline-light border d-flex align-items-center justify-content-center"
                            >
                              <ImageWithBasePath
                                className="img-fluid m-1"
                                src="assets/img/icons/facebook-logo.svg"
                                alt="Facebook"
                              />
                            </Link>
                          </div>
                          <div className="text-center me-2 flex-fill">
                            <Link
                              to="#"
                              className="br-10 p-1 btn btn-outline-light border d-flex align-items-center justify-content-center"
                            >
                              <ImageWithBasePath
                                className="img-fluid m-1"
                                src="assets/img/icons/google-logo.svg"
                                alt="Google"
                              />
                            </Link>
                          </div>
                          <div className="text-center me-2 flex-fill">
                            <Link
                              to="#"
                              className="br-10 p-1 btn btn-outline-light border d-flex align-items-center justify-content-center"
                            >
                              <ImageWithBasePath
                                className="img-fluid m-1"
                                src="assets/img/icons/apple-logo.svg"
                                alt="apple"
                              />
                            </Link>
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="text-center">
                        <h6 className="fw-normal fs-14 text-dark mb-0">
                          Don’t have an account yet?
                          <Link to={all_routes.registerbasic} className="hover-a">
                            
                            Register
                          </Link>
                        </h6>
                      </div> */}
                    </div>
                    {/* end card body */}
                  </div>
                  {/* end card */}
                </div>
              </form>
              {/* <p className="text-dark text-center">
                
                Copyright © 2025 - Preclinic
              </p> */}
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </div>
      {/* End Content */}
    </>
  );
};

export default Login;
