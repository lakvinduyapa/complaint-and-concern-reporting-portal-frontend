import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../services/adminAuthService";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6"; 

const COLORS = {
  navy: "#0B2E73",
  blue: "#145D93",
  teal: "#0D6B68",
  green: "#32B44A",
  light: "#EEF5FA",
  white: "#FFFFFF",
};

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EEF5FA] via-[#F6FAFC] to-[#ECF7F4] flex items-center justify-center px-4
py-6
sm:px-6
lg:px-10
xl:px-16">    {/* Top Left */}
<div className="absolute -top-48 -left-40 w-[520px] h-[520px] rounded-full bg-[#32B44A]/25 blur-[130px]" />

{/* Top Right */}
<div className="absolute -top-44 -right-32 w-[480px] h-[480px] rounded-full bg-[#1F5EA8]/25 blur-[140px]" />

 

<div
    className="absolute inset-0 opacity-[0.015]"
    style={{
        backgroundImage: `
        linear-gradient(to right,#1F5EA8 1px,transparent 1px),
        linear-gradient(to bottom,#1F5EA8 1px,transparent 1px)
        `,
        backgroundSize: "70px 70px",
    }}
/>
   

  

<div
className="
absolute
w-[1220px]
h-[700px]
rounded-[40px]
border
border-white/40
bg-white/10
backdrop-blur-sm
border-white/20
shadow-[0_30px_80px_rgba(31,94,168,.08)]
"
/>

  {/* Login Container */}
      <div
className="
relative
z-10
w-full
max-w-5xl
min-h-[620px]
bg-white/90
backdrop-blur-xl
border
border-white/70
rounded-[32px]
overflow-hidden
shadow-[0_40px_100px_rgba(31,94,168,.18)]
grid
grid-cols-1
lg:grid-cols-[1fr_0.95fr]
"
>
        {/* Left Side */}
        <div className="hidden xl:flex relative overflow-hidden p-10 bg-[linear-gradient(135deg,#0B2E73_0%,#145D93_55%,#0F6E72_100%)]">

          {/* Shapes */}
          <div className="absolute top-[-120px] right-[-80px] w-[350px] h-[350px] rounded-full bg-white/10"></div>

          <div
className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-[500px]
h-[500px]
rounded-full
bg-cyan-400/10
blur-[130px]
"/>
          <div className="relative z-10 flex flex-col h-full">
          
          

            <div className="mt-6">
    <img
        src="/slt-logo.png"
        alt="SLTMobitel"
        className="w-44"
    />
</div>

<div className="mt-12 mb-6">
    <div className="w-20 h-1 rounded-full bg-cyan-300"></div>
</div>

<h1 className="text-3xl
lg:text-4xl
xl:text-5xl font-bold leading-tight">
    Internal Affairs Unit (IAU)
</h1>

<p className="text-2xl mt-5 text-white/90">
    Complaint & Concern Reporting System
</p>

<p className="mt-10 text-lg leading-8 text-white/80 max-w-sm">
    A secure platform to report, track and resolve complaints efficiently and confidentially.
</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white/80 backdrop-blur-xl flex items-center justify-center p-8 md:p-6
md:px-4
py-6
sm:px-6
lg:px-10
xl:px-16
xl:p-10">

          <div className="relative z-10 w-full max-w-lg h-full flex flex-col">

            
            <div className="flex justify-center mb-8">
              <div
className="
w-24
h-24
rounded-full
bg-gradient-to-r
from-[#0B2E73]
via-[#145D93]
to-[#0D6B68]
flex
items-center
justify-center
shadow-[0_20px_45px_rgba(31,94,168,.35)]
ring-4
ring-blue-100
">                <FaUserShield className="text-white text-4xl" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="
text-4xl
font-bold
bg-gradient-to-r
from-[#0B2E73]
via-[#0B5F7A]
to-[#32B44A]
bg-clip-text
text-transparent
">
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
          
            <form
    onSubmit={handleSubmit}
    className="space-y-4 flex-1"
>

              {/* Email */}
              <div>
                <label className="
block
text-[15px]
font-semibold
tracking-wide
text-slate-700
mb-2
">
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
                    className="
w-full
h-14
md:h-16
rounded-2xl
bg-white
border
border-slate-200
shadow-lg
shadow-blue-100/40
pl-14
pr-5
text-base
placeholder:text-slate-400
transition-all
duration-300
focus:border-[#1F5EA8]
focus:ring-4
focus:ring-blue-100
hover:border-blue-300
"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1F5EA8]" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                    className="w-full h-16 rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-base focus:outline-none focus:ring-4 focus:ring-[#1F5EA8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-white text-lg
md:text-xl font-bold shadow-[0_18px_45px_rgba(31,94,168,.30)] bg-gradient-to-r
from-[#0B2E73]
via-[#145D93]
to-[#0D6B68] hover:scale-[1.03]
hover:brightness-110
active:scale-[0.98]
transition-all
duration-300 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>


            </form>

            <div className="text-center mt-auto pt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-slate-200 text-[#1F5EA8] font-semibold hover:bg-slate-200 transition-all"
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

