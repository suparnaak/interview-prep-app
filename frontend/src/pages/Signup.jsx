import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { signupApi } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingButton from "../components/LoadingButton";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password)
      return toast.error("All fields are required");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await signupApi({ name, email, password });

      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));

      toast.success("Signup successful");
      navigate("/upload", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      role="main"
      aria-labelledby="signup-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2
          id="signup-title"
          className="text-2xl font-semibold mb-6 text-gray-800 text-center"
        >
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Signup Form"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name{" "}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-required="true"
              aria-label="Full name"
              placeholder="Your full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email{" "}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-label="Email address"
              placeholder="you@example.com"
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
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              aria-label="Password"
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Submit */}
          <LoadingButton
            type="submit"
            text="Signup"
            loading={loading}
            aria-label="Signup button"
            aria-busy={loading}
            className="w-full"
          />
        </form>

        <p
          className="text-sm text-center text-gray-600 mt-4"
          aria-live="polite"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
