import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Logo from "../../components/Logo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: emailFromState,
    otp: "",
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

    if (!form.email || !form.otp || !form.password) {
      toast.error("Please fill in email, OTP, and new password");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", form);
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* Left Visual Banner */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-[#111118] p-12 lg:flex">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 mx-auto my-auto max-w-sm space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">VERIFICATION</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Set New Password
            </h2>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Enter the OTP verification code received in your inbox along with your new secure password.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} CampusPass Platform
        </div>
      </div>

      {/* Form Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Reset Password
            </h1>
            <p className="text-sm text-gray-400">
              Verify your OTP and choose a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@college.edu"
              icon={Mail}
            />

            <InputField
              label="OTP Code"
              name="otp"
              type="text"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              icon={KeyRound}
            />

            <div className="relative">
              <InputField
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
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

            <Button type="submit" loading={loading}>
              <span className="flex items-center justify-center gap-2">
                <span>Update Password</span>
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Remembered password?{" "}
            <Link to="/login" className="font-bold text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
