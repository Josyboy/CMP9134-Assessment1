import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../services/api";
import { AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import PageHelmet from "../components/PageHelmet";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    forename: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    forename?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Forename validation
    if (!formData.forename.trim()) {
      newErrors.forename = "Forename is required";
    } else if (formData.forename.length < 2) {
      newErrors.forename = "Forename must be at least 2 characters";
    } else if (formData.forename.length > 100) {
      newErrors.forename = "Forename must be less than 100 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await apiService.register(
        formData.forename,
        formData.email,
        formData.password,
      );

      if (response.success) {
        navigate("/login");
      } else {
        setErrors({
          general: response.message || "Registration failed. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err.response?.status === 409) {
        setErrors({ general: "Username or email already exists" });
      } else {
        setErrors({
          general: "Connection error. Please check your network and try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (user) {
      navigate("/dashboard");
      return;
    }
  }, []);

  return (
    <>
      <PageHelmet
        title="Sign Up | Robot GCS"
        description="Create an account to access the Ground Control Station."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-300 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-full mb-3 ">
              <img
                src="/pngwing.com.png"
                alt="robot"
                className="h-[110px] w-[110px]"
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Create Account
            </h1>
            <p className="text-slate-600 mt-2">Join the Robot Control System</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Forename *
              </label>
              <input
                type="text"
                name="forename"
                value={formData.forename}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors.forename ? "border-red-500" : "border-slate-300"}`}
                placeholder="Enter forename"
                disabled={loading}
              />
              {errors.forename && (
                <p className="mt-1 text-xs text-red-600">{errors.forename}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${errors.email ? "border-red-500" : "border-slate-300"}`}
                placeholder="you@example.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-10
                  ${errors.password ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Create a password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-10
                  ${errors.confirmPassword ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <CheckCircle className="w-3 h-3" />
              <span>Secure registration</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <CheckCircle className="w-3 h-3" />
              <span>Password encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
