import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { loginSuccess } from "../../redux/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
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

    if (!form.fullName || !form.email || !form.mobile || !form.password) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/register", form);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      dispatch(loginSuccess({ token, user }));

      toast.success("Account created successfully!");
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* Left Visual Banner */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-[#111118] p-12 lg:flex">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 mx-auto my-auto max-w-sm space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">JOIN CAMPUSPASS</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white leading-tight">
              Create Your Digital Campus Pass
            </h2>

            <div className="mt-6 space-y-3 rounded-2xl bg-black/40 p-4 border border-white/5 text-xs text-gray-300">
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-blue-400">✓</span> Instant QR Code Pass Generation
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-blue-400">✓</span> Real-Time Schedule & Venue Alerts
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-blue-400">✓</span> Save & Favorite Upcoming Fests
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} CampusPass Platform. All rights reserved.
        </div>
      </div>

      {/* Register Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Join thousands of students discovering events across campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Aman Singh"
              value={form.fullName}
              onChange={handleChange}
              icon={User}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="aman@gmail.com"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
            />

            <InputField
              label="Mobile Number"
              name="mobile"
              type="text"
              placeholder="9876543210"
              value={form.mobile}
              onChange={handleChange}
              icon={Phone}
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

            <Button type="submit" loading={loading}>
              <span className="flex items-center justify-center gap-2">
                <span>Create Student Account</span>
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
