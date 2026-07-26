import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { logout } from "../redux/authSlice";
import NotificationBell from "../components/NotificationBell";

const SidebarLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const getLinks = () => {
    switch (user?.role) {
      case "admin":
        return [
          {
            path: "/admin/dashboard",
            label: "Admin Dashboard",
            icon: "📊",
          },
          {
            path: "/admin/events",
            label: "Manage Events",
            icon: "📋",
          },
          {
            path: "/admin/users",
            label: "Manage Users",
            icon: "👥",
          },
        ];

      case "organizer":
        return [
          {
            path: "/organizer/dashboard",
            label: "Dashboard",
            icon: "📊",
          },
          {
            path: "/organizer/events",
            label: "My Events",
            icon: "📋",
          },
          {
            path: "/organizer/create",
            label: "Create Event",
            icon: "➕",
          },
        ];

      default:
        return [
          {
            path: "/home",
            label: "Home",
            icon: "🏠",
          },
          {
            path: "/browse",
            label: "Browse Events",
            icon: "🔍",
          },
          {
            path: "/bookings",
            label: "My Bookings",
            icon: "📅",
          },
          {
            path: "/favorites",
            label: "Favorites",
            icon: "❤️",
          },
          {
            path: "/profile",
            label: "Profile",
            icon: "👤",
          },
        ];
    }
  };

  const links = getLinks();

  const initials =
    user?.fullName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  const homeRoute =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "organizer"
      ? "/organizer/dashboard"
      : "/home";

  const menuContent = (
    <>
      {/* Logo */}
      <div
        className="sidebar-logo"
        onClick={() => {
          setMobileOpen(false);
          navigate(homeRoute);
        }}
      >
        <svg width="28" height="28" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#3b82f6" />
          <rect
            x="8"
            y="12"
            width="48"
            height="40"
            rx="8"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
          <rect
            x="16"
            y="18"
            width="32"
            height="10"
            rx="3"
            fill="#fff"
            opacity="0.4"
          />
          <rect
            x="16"
            y="36"
            width="20"
            height="7"
            rx="2"
            fill="#fff"
            opacity="0.4"
          />
        </svg>

        <span className="logo-text">CampusPass</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? user.role === "admin"
                    ? "active-admin"
                    : user.role === "organizer"
                    ? "active-o"
                    : "active"
                  : ""
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          className="sidebar-link"
          onClick={handleLogout}
          style={{ color: "#f87171" }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">{menuContent}</aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mobile-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            {menuContent}
          </div>
        </div>
      )}

      {/* Right Content */}
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <button
            className="menu-btn"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>

          <div className="topbar-title">
            <span>📍 PCCOE, Pune</span>
            <h3>Campus Events Portal</h3>
          </div>

          <div className="topbar-right">
            <NotificationBell />

            <div
              className="avatar"
              onClick={() =>
                user.role === "student" && navigate("/profile")
              }
            >
              {initials}
            </div>

            <span>{user?.fullName?.split(" ")[0]}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;