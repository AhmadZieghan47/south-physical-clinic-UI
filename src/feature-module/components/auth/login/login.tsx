import { Link } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { login } from "../../../../services/authService";

import "./login.css";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(data.email, data.password);

      console.log("Login successful:", response);

      // Auth service automatically stores token and user data
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
            <div className="col-lg-4 mx-auto">
              <form
                className="d-flex justify-content-center align-items-center"
                onSubmit={handleSubmit(onSubmit)}
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
                      </div>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text border-end-0 bg-white">
                            <i className="ti ti-mail fs-14 text-dark" />
                          </span>
                          <input
                            type="email"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Email Address"
                            {...register("email")}
                          />
                        </div>
                        {errors.email && (
                          <div className="invalid-feedback d-block">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="position-relative">
                          <div className="pass-group input-group position-relative border rounded">
                            <span className="input-group-text bg-white border-0">
                              <i className="ti ti-lock text-dark fs-14" />
                            </span>
                            <input
                              type={passwordVisibility ? "text" : "password"}
                              className={`pass-input form-control border-0 ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              placeholder="****************"
                              {...register("password")}
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
                        {errors.password && (
                          <div className="invalid-feedback d-block">
                            {errors.password.message}
                          </div>
                        )}
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
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Signing In...
                            </>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
