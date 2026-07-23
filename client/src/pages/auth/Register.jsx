import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const Register = () => {
  const navigate = useNavigate();

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
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", form);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
          {/* CREATE ACCOUNT CARD */}

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
              JOIN CAMPUSPASS
            </p>

            <h2
              className="
              mt-3
              text-3xl
              font-bold
              "
            >
              Create Your
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
              <p className="text-sm text-gray-400">Everything in one place</p>

              <p
                className="
              mt-4
              font-semibold
              "
              >
                🎓 College Events
              </p>

              <p
                className="
              mt-3
              font-semibold
              "
              >
                🎟 Digital Passes
              </p>

              <p
                className="
              mt-3
              font-semibold
              "
              >
                🚀 Campus Experience
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
            🎤 Events
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
            👥 Community
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

      {/* REGISTER FORM */}

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
            Create Account
          </h1>

          <p
            className="
            mt-2
            text-gray-400
            "
          >
            Register to continue with CampusPass
          </p>

          <form
            onSubmit={handleSubmit}
            className="
            mt-8
            space-y-5
            "
          >
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              icon={User}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@gmail.com"
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
                placeholder="********"
                value={form.password}
                onChange={handleChange}
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
              Create Account
            </Button>
          </form>

          <p
            className="
            mt-8
            text-gray-400
            "
          >
            Already have an account?{" "}
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

export default Register;
