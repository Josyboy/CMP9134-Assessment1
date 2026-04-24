import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import PageHelmet from "../components/PageHelmet";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Connection error. Please try again.",
      );
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
        title="Log In | Robot GCS"
        description="Log in to access the Ground Control Station."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-300 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center w-full mb-3 ">
            <img
              src="/pngwing.com.png"
              alt="robot"
              className="h-[110px] w-[110px]"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Robot Control System
            </h1>
            <p className="text-slate-600 mt-2">Ground Control Station</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-10
                  border-slate-300`}
                  placeholder="Enter password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500 text-center">
            No account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
