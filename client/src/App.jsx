import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import api from "./api/axios";
import { loginSuccess, logout } from "./redux/authSlice";

// Layouts
import MainLayout from "./layouts/MainLayout";
import SidebarLayout from "./layouts/SidebarLayout";

// Route Guards
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// Landing Pages
import Splash from "./pages/landing/Splash";
import About from "./pages/landing/About";
import Contact from "./pages/landing/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Student Pages
import Home from "./pages/student/Home";
import BrowseEvents from "./pages/student/BrowseEvents";
import EventDetail from "./pages/student/EventDetail";
import EventMap from "./pages/student/EventMap";
import BookTickets from "./pages/student/BookTickets";
import Payment from "./pages/student/Payment";
import ETicket from "./pages/student/ETicket";
import MyBookings from "./pages/student/MyBookings";
import Favorites from "./pages/student/Favorites";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Organizer Pages
import OrgDashboard from "./pages/organizer/OrgDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import ManageEvents from "./pages/organizer/ManageEvents";
import Attendees from "./pages/organizer/Attendees";
import QRScanPage from "./pages/organizer/QRScanPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageAllEvents from "./pages/admin/ManageAllEvents.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        
        
        const response = await api.get("/auth/me");


      dispatch(
        loginSuccess({
          token: token,
          user: response.data.data, // <-- Correct
        })
        );
      } catch (error) {
        localStorage.removeItem("token");
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
    Loading...
  </div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* Guest-only pages: landing + auth routes */}
        <Route element={<GuestRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Splash />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Shared Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id/map" element={<EventMap />} />
          <Route path="/ticket/:bookingId" element={<ETicket />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
 
        {/* Student */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route element={<SidebarLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/browse" element={<BrowseEvents />} />
            <Route path="/event/:id/book" element={<BookTickets />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Organizer */}
        <Route element={<ProtectedRoute role="organizer" />}>
          <Route element={<SidebarLayout />}>
            <Route
              path="/organizer/dashboard"
              element={<OrgDashboard />}
            />
            <Route
              path="/organizer/create"
              element={<CreateEvent />}
            />
            <Route
              path="/organizer/events"
              element={<ManageEvents />}
            />
            <Route
              path="/organizer/attendees"
              element={<Attendees />}
            />
            <Route
              path="/organizer/attendees/:eventId"
              element={<Attendees />}
            />
            <Route
              path="/organizer/scan/:eventId"
              element={<QRScanPage />}
            />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<SidebarLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/events"
              element={<ManageAllEvents />}
            />
            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;