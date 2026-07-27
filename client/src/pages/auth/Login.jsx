import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
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
    return toast.error("Please fill all fields");
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/login", form);

    const { token, user } = response.data.data;


    localStorage.setItem("token", token);

    dispatch(
      loginSuccess({
        token,
        user,
      })
    );

    toast.success("Welcome back!");

    const routes = {
      admin: "/admin/dashboard",
      organizer: "/organizer/dashboard",
      student: "/home",
    };

    navigate(routes[user.role] || "/", {
      replace: true,
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login failed"
    );
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
      {/* LEFT VISUAL SECTION */}

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
          {/* EVENT CARD */}

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
            <div
              className="
              flex
              justify-between
              items-center
            "
            >
              <div>
                <p
                  className="
                  text-xs
                  text-gray-400
                "
                >
                  EVENT PASS
                </p>

                <h2
                  className="
                  mt-2
                  text-2xl
                  font-bold
                "
                >
                  Tech Fest 2026
                </h2>
              </div>

              <div
                className="
                rounded-xl
                bg-blue-500/20
                p-3
              "
              >
                🎟️
              </div>
            </div>

            <div
              className="
              mt-8
              rounded-2xl
              bg-black/40
              p-4
            "
            >
              <p
                className="
                text-xs
                text-gray-400
              "
              >
                EVENT TYPE
              </p>

              <p
                className="
                mt-1
                font-semibold
              "
              >
                College Cultural & Tech Event
              </p>
            </div>

            <div
              className="
              mt-5
              flex
              items-center
              justify-between
            "
            >
              <span
                className="
                rounded-full
                bg-green-500/20
                px-3
                py-1
                text-xs
                text-green-400
              "
              >
                Confirmed
              </span>

              <div
                className="
                rounded-lg
                bg-white
                px-3
                py-2
                text-black
                text-sm
                font-bold
              "
              >
                QR
              </div>
            </div>
          </div>

          {/* SMALL EVENT TAGS */}

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
            🎤 Music Night
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
            🚀 Hackathon
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

      {/* LOGIN SECTION */}

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
            Welcome Back
          </h1>

          <p
            className="
            mt-2
            text-gray-400
          "
          >
            Sign in to continue
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
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
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

            <div
              className="
              flex
              justify-end
            "
            >
              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-blue-500
                "
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" loading={loading}>
              Sign In
            </Button>
          </form>

          <p
            className="
            mt-8
            text-gray-400
          "
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="
                text-blue-500
                font-semibold
              "
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
