import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../services/adminAuthService";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await adminLogin(normalizedEmail, password);
      if (response?.user) {
        login(response.user);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card - translucent to match background */}
        <div className="rounded-2xl p-8 bg-white/6 backdrop-blur-sm border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Admin Portal
            </h1>
            <p className="text-white/80 text-sm">
              Internal Affairs Unit — Complaint Investigation System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@iau.com"
                disabled={loading}
                className="ui-input bg-transparent border-white/20 text-white placeholder-white/60 disabled:bg-white/5 disabled:text-white/40"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="ui-input bg-transparent border-white/20 text-white placeholder-white/60 disabled:bg-white/5 disabled:text-white/40"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 disabled:bg-white/20 disabled:cursor-not-allowed mt-6 rounded-xl font-semibold transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/70 text-xs mt-6">
            Authorized personnel only. All activity is logged.
          </p>
        </div>

        {/* Public Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="link-on-dark text-sm"
          >
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
