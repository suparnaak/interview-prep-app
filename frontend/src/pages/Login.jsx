import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { loginApi } from "../api/authApi";
import { useNavigate, Link, useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../components/LoadingButton";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/upload";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("Email and Password are required");
    }

    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      toast.success("Login successful");
      navigate("/upload", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";

      console.log("Final message:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <main
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-8"
        role="main"
        aria-labelledby="login-heading"
      >
        <h2
          id="login-heading"
          className="text-2xl font-semibold mb-6 text-gray-800 text-center"
        >
          Login to Your Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Login Form"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-required="true"
              aria-label="Email address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              aria-required="true"
              aria-label="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Loading Button */}
          <LoadingButton
            type="submit"
            text="Login"
            loading={loading}
            className="w-full"
            aria-label="Login button"
            aria-busy={loading}
          />
        </form>

        <p
          className="text-sm text-center text-gray-600 mt-4"
          role="note"
          aria-live="polite"
        >
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
