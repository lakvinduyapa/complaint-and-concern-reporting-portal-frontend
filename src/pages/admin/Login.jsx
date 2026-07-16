import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { adminLogin } from "../../services/adminAuthService";
import { useAdminAuth } from "../../hooks/useAdminAuth";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { FaUserShield } from "react-icons/fa6";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div
      className="
        relative
        flex
        min-h-[100dvh]
        items-start
        justify-center
        overflow-x-hidden
        overflow-y-auto
        bg-gradient-to-br
        from-[#EEF5FA]
        via-[#F6FAFC]
        to-[#ECF7F4]
        px-3
        py-4
        sm:items-center
        sm:px-6
        sm:py-6
        lg:px-10
        xl:px-16
      "
    >
      {/* Background decorations */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-48
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#32B44A]/25
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-44
          h-[480px]
          w-[480px]
          rounded-full
          bg-[#1F5EA8]/25
          blur-[140px]
        "
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1F5EA8 1px, transparent 1px),
            linear-gradient(to bottom, #1F5EA8 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          hidden
          h-[calc(100%-2rem)]
          max-h-[700px]
          w-[calc(100%-2rem)]
          max-w-[1220px]
          rounded-[40px]
          border
          border-white/20
          bg-white/10
          shadow-[0_30px_80px_rgba(31,94,168,.08)]
          backdrop-blur-sm
          sm:block
        "
      />

      {/* Login container */}
      <div
        className="
          relative
          z-10
          grid
          min-h-0
          w-full
          max-w-[1000px]
          grid-cols-1
          overflow-hidden
          rounded-[22px]
          border
          border-white/70
          bg-white/90
          shadow-[0_40px_100px_rgba(31,94,168,.18)]
          backdrop-blur-xl
          sm:rounded-[28px]
          lg:min-h-[620px]
          lg:grid-cols-[1fr_0.95fr]
          lg:rounded-[32px]
        "
      >
        {/* Left side */}
        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-[linear-gradient(135deg,#0B2E73_0%,#145D93_55%,#0F6E72_100%)]
            p-10
            lg:flex
          "
        >
          {/* Decorative shapes */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-[120px]
              h-[350px]
              w-[350px]
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[500px]
              w-[500px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-cyan-400/10
              blur-[130px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-10
              top-12
              h-56
              w-64
              rounded-full
              bg-cyan-300/10
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              h-full
              w-full
              flex-col
              justify-between
              gap-10
            "
          >
            {/* Top content */}
            <div>
              <img
                src="/slt-logo.png"
                alt="SLTMobitel"
                className="mb-10 w-52 object-contain"
              />

              <div className="mb-10 h-1 w-20 rounded-full bg-cyan-300" />

              <h1
                className="
                  mb-5
                  text-3xl
                  font-bold
                  leading-tight
                  text-white
                  xl:text-4xl
                "
              >
                Internal Affairs Unit (IAU)
              </h1>

              <p className="text-xl leading-relaxed text-white/90 xl:text-2xl">
                Complaint &amp; Concern Reporting System
              </p>
            </div>

            {/* Bottom content */}
            <div className="flex items-center gap-5">
              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                "
              >
                <FaUserShield className="text-4xl text-cyan-200" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white xl:text-2xl">
                  Secure. Confidential.
                </h3>

                <p className="mt-1 text-lg text-white/80 xl:text-xl">
                  Responsible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div
          className="
            flex
            items-center
            justify-center
            bg-white/80
            px-5
            py-6
            backdrop-blur-xl
            sm:px-8
            sm:py-8
            lg:px-10
            lg:py-10
            xl:px-12
          "
        >
          <div className="relative z-10 flex w-full max-w-lg flex-col">
            {/* Login icon */}
            <div className="mb-5 flex justify-center sm:mb-7 lg:mb-8">
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-r
                  from-[#0B2E73]
                  via-[#145D93]
                  to-[#0D6B68]
                  shadow-[0_20px_45px_rgba(31,94,168,.35)]
                  ring-4
                  ring-blue-100
                  sm:h-20
                  sm:w-20
                  lg:h-24
                  lg:w-24
                "
              >
                <FaUserShield
                  className="
                    text-2xl
                    text-white
                    sm:text-3xl
                    lg:text-4xl
                  "
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center sm:mb-8">
              <h1
                className="
                  bg-gradient-to-r
                  from-[#0B2E73]
                  via-[#0B5F7A]
                  to-[#32B44A]
                  bg-clip-text
                  text-3xl
                  font-bold
                  text-transparent
                  sm:text-4xl
                "
              >
                Welcome
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  sm:mt-3
                  sm:text-base
                  lg:text-lg
                "
              >
                Sign in to continue to your account
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="
                  mb-5
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-sm
                  text-red-700
                  sm:mb-6
                "
              >
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-semibold
                    tracking-wide
                    text-slate-700
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope
                    className="
                      pointer-events-none
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    autoComplete="email"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      pl-14
                      pr-4
                      text-sm
                      shadow-lg
                      shadow-blue-100/40
                      outline-none
                      transition-all
                      duration-300
                      hover:border-blue-300
                      focus:border-[#145D93]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-100
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      sm:h-16
                      sm:text-base
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-semibold
                    tracking-wide
                    text-slate-700
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <FaLock
                    className="
                      pointer-events-none
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      text-[#1F5EA8]
                    "
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      pl-14
                      pr-14
                      text-sm
                      shadow-lg
                      shadow-blue-100/40
                      outline-none
                      transition-all
                      duration-300
                      hover:border-blue-300
                      focus:border-[#145D93]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-100
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      sm:h-16
                      sm:text-base
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1
                      text-slate-400
                      transition-colors
                      hover:text-[#145D93]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-100
                      disabled:cursor-not-allowed
                    "
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-xl" />
                    ) : (
                      <FaEye className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#0B2E73]
                  via-[#145D93]
                  to-[#0D6B68]
                  text-base
                  font-bold
                  text-white
                  shadow-[0_18px_45px_rgba(31,94,168,.30)]
                  transition-all
                  duration-300
                  hover:shadow-[0_22px_50px_rgba(20,93,147,.35)]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:h-14
                  sm:text-lg
                  sm:hover:scale-[1.02]
                  md:text-xl
                "
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Back button */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-slate-200
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-[#1F5EA8]
                  transition-all
                  hover:bg-slate-300
                  sm:w-auto
                  sm:px-5
                  sm:text-base
                "
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