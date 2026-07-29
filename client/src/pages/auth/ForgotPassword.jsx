import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Logo from "../../components/Logo";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Verification code sent to your email!");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong sending reset code.");
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">SECURITY & ACCESS</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Account Recovery
            </h2>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              We'll send a 6-digit verification OTP to your registered campus email address to safely reset your password.
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
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-400">
              Enter your email address to receive an OTP verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <Button type="submit" loading={loading}>
              <span className="flex items-center justify-center gap-2">
                <span>Send Verification OTP</span>
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
