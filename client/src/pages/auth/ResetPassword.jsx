import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

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
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", form);

      toast.success("Password reset successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      bg-black
      text-white
      "
    >
      {/* LEFT SECTION */}

      <div
        className="
        hidden
        lg:flex
        lg:w-1/2
        bg-[#151515]
        flex-col
        justify-between
        p-12
        relative
        overflow-hidden
        "
      >
        <div
          className="
          absolute
          top-32
          left-32
          h-72
          w-72
          rounded-full
          bg-blue-500/20
          blur-3xl
          "
        />

        <div
          className="
          relative
          flex
          h-full
          items-center
          justify-center
          "
        >
          {/* OTP CARD */}

          <div
            className="
            w-80
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl
            "
          >
            <p
              className="
              text-xs
              text-gray-400
              "
            >
              PASSWORD RECOVERY
            </p>

            <h2
              className="
              mt-3
              text-3xl
              font-bold
              "
            >
              Verify
              <br />
              OTP
            </h2>

            <div
              className="
              mt-8
              rounded-2xl
              bg-black/40
              p-5
              "
            >
              <p className="text-gray-400 text-sm">
                Enter the OTP sent to your email
              </p>

              <p
                className="
                mt-4
                font-semibold
                "
              >
                🔑 Secure Verification
              </p>

              <p
                className="
                mt-3
                font-semibold
                "
              >
                🔐 New Password Setup
              </p>
            </div>
          </div>

          <div
            className="
            absolute
            left-10
            top-1/3
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            backdrop-blur
            "
          >
            🔑 OTP
          </div>

          <div
            className="
            absolute
            right-10
            bottom-1/3
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            backdrop-blur
            "
          >
            🛡️ Secure
          </div>
        </div>

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          © {new Date().getFullYear()} CampusPass
        </p>
      </div>

      {/* FORM */}

      <div
        className="
        flex
        flex-1
        items-center
        justify-center
        p-8
        "
      >
        <div
          className="
          w-full
          max-w-md
          "
        >
          <h1
            className="
            text-3xl
            font-bold
            "
          >
            Reset Password
          </h1>

          <p
            className="
            mt-2
            text-gray-400
            "
          >
            Enter OTP and create a new password
          </p>

          <form
            onSubmit={handleSubmit}
            className="
            mt-8
            space-y-5
            "
          >
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              icon={Mail}
            />

            <InputField
              label="OTP"
              name="otp"
              type="text"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              icon={KeyRound}
            />

            <div className="relative">
              <InputField
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                icon={Lock}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                absolute
                right-4
                top-10
                text-gray-400
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" loading={loading}>
              Reset Password
            </Button>
          </form>

          <p
            className="
            mt-8
            text-gray-400
            "
          >
            Remember password?{" "}
            <Link
              to="/login"
              className="
              text-blue-500
              font-semibold
              "
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
