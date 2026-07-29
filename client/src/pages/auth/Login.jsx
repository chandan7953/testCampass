import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginSuccess } from "../../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", form);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      dispatch(loginSuccess({ token, user }));

      toast.success(`Welcome back, ${user.fullName}!`);

      const routes = {
        admin: "/admin/dashboard",
        organizer: "/organizer/dashboard",
        student: "/home",
      };

      navigate(routes[user.role] || "/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* Visual Showcase (Desktop Left) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-[#111118] p-12 lg:flex">
        {/* Glow Spheres */}
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative z-10">
          <Logo />
        </div>

        {/* Floating Pass Card Showcase */}
        <div className="relative z-10 mx-auto my-auto max-w-sm space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">OFFICIAL EVENT PASS</p>
                <h3 className="mt-1 text-2xl font-extrabold text-white">Annual TechFest 2026</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                🎟️
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-black/40 p-4 border border-white/5 space-y-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase">ACCESS ROLE</p>
              <p className="text-sm font-bold text-white">Verified Student Pass</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Confirmed
              </span>
              <span className="font-mono text-xs font-bold text-gray-400">#CP-2026-X9</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 backdrop-blur-md">
              ✨ 1-Click Ticket Booking
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 backdrop-blur-md">
              ⚡ Instant QR Pass
            </span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} CampusPass Platform. All rights reserved.
        </div>
      </div>

      {/* Login Form (Right) */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to manage your bookings and explore campus events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="student@college.edu"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
            />

            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                icon={Lock}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" loading={loading}>
              <span className="flex items-center justify-center gap-2">
                <span>Sign In to Account</span>
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-400 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
