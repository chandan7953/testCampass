import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import api from "./api/axios";
import { loginSuccess, logout } from "./redux/authSlice";

import Navbar from "./components/Navbar";

import Splash from "./pages/landing/Splash";
import About from "./pages/landing/About";
import Contact from "./pages/landing/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Home from "./pages/student/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";

function App() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuthentication = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      dispatch(
        loginSuccess({
          token: storedToken,
          user: response.data.data, // <-- Correct
        })
      );
    } catch (err) {
      console.error(err);

      localStorage.removeItem("token");
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  };

  checkAuthentication();
}, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-white">
        Loading...
      </div>
    );
  }

  const getDashboard = () => {
    if (!token || !user) return <Splash />;

    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/home" replace />;

      case "organizer":
        return <Navigate to="/organizer/home" replace />;

      case "student":
      default:
        return <Navigate to="/home" replace />;
    }
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <Routes>
        {/* Landing */}
        <Route path="/" element={getDashboard()} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboards */}
        <Route path="/home" element={<Home />} />

        <Route
          path="/admin/home"
          element={<AdminDashboard />}
        />

        <Route
          path="/organizer/home"
          element={<OrganizerDashboard />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;