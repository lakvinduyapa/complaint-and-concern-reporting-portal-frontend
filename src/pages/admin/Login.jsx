import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../services/adminAuthService";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";

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

      const response = await adminLogin(
        normalizedEmail,
        password
      );

      if (response?.user) {
        login(response.user);
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl min-h-[78vh] bg-white rounded-[36px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex relative overflow-hidden p-12 bg-gradient-to-br from-[#32B44A] via-[#1F5EA8] to-[#032B88]">

          {/* Shapes */}
          <div className="absolute top-[-120px] right-[-80px] w-[350px] h-[350px] rounded-full bg-white/10"></div>

          <div className="absolute bottom-[-100px] left-[-100px] w-[250px] h-[250px] rounded-full bg-white/10"></div>

          <div className="relative z-10 flex flex-col justify-center text-white">

            <img
              src="/slt-logo.png"
              alt="SLTMobitel"
              className="w-52 mb-8"
            />

            <div className="w-20 h-1 bg-teal-300 rounded-full mb-10"></div>

            <h1 className="text-4xl font-bold leading-tight mb-6">
              Internal Affairs Unit (IAU)
            </h1>

            <p className="text-xl text-slate-100 mb-20">
              Complaint & Concern Reporting System
            </p>

            <div className="flex items-center gap-6">

              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <FaUserShield className="text-4xl text-green-200" />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">
                  Secure. Confidential. Responsible.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white flex items-center justify-center p-8 md:p-10">

          <div className="w-full max-w-lg">

            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#032B88] via-[#1F5EA8] to-[#32B44A] flex items-center justify-center shadow-xl">
                <FaUserShield className="text-white text-4xl" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#032B88] via-[#1F5EA8] to-[#32B44A] bg-clip-text text-transparent">
                Welcome
              </h1>

              <p className="text-slate-500 text-lg mt-3">
                Sign in to continue to your account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full h-14 rounded-3xl border-2 border-slate-200 bg-white shadow-sm pl-14 pr-5 text-lg focus:outline-none focus:ring-2 focus:ring-[#1F5EA8]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                    className="w-full h-14 rounded-3xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-lg focus:outline-none focus:ring-2 focus:ring-[#1F5EA8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-3xl text-white text-2xl font-bold shadow-xl bg-gradient-to-r from-[#032B88] via-[#1F5EA8] to-[#32B44A] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className="text-center mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-slate-100 text-[#1F5EA8] font-semibold hover:bg-slate-200 transition-all"
              >
                ← Back to Public Portal
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;

