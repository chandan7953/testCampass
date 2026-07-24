import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email,
      });

      toast.success("OTP sent to your email");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message || "Something went wrong");
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
          {/* RESET CARD */}

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
              ACCOUNT SECURITY
            </p>

            <h2
              className="
              mt-3
              text-3xl
              font-bold
              "
            >
              Recover
              <br />
              Account
            </h2>

            <div
              className="
              mt-8
              rounded-2xl
              bg-black/40
              p-5
              "
            >
              <p className="text-gray-400 text-sm">Secure password recovery</p>

              <p
                className="
              mt-4
              font-semibold
              "
              >
                🔐 OTP Verification
              </p>

              <p
                className="
              mt-3
              font-semibold
              "
              >
                📧 Email Protection
              </p>

              <p
                className="
              mt-3
              font-semibold
              "
              >
                ✅ Safe Access
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
            🔒 Security
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
            📩 OTP
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

      {/* FORM SECTION */}

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
            Forgot Password
          </h1>

          <p
            className="
            mt-2
            text-gray-400
            "
          >
            Enter your email to receive OTP
          </p>

          <form
            onSubmit={handleSubmit}
            className="
            mt-8
            space-y-6
            "
          >
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <Button type="submit" loading={loading}>
              Send OTP
            </Button>
          </form>

          <p
            className="
            mt-8
            text-gray-400
            "
          >
            Remember your password?{" "}
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

export default ForgotPassword;
