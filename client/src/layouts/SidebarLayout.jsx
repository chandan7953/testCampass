import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { LogOut, Menu, X, ChevronRight } from "lucide-react";

import { logout } from "../redux/authSlice";
import NotificationBell from "../components/NotificationBell";
import Logo from "../components/Logo";
import { getNavLinksByRole, getHomeRouteByRole } from "../constants/navigation";
import { getInitials } from "../utils/formatters";

const SidebarLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/home" || path === "/organizer/dashboard" || path === "/admin/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const links = getNavLinksByRole(user?.role);
  const homeRoute = getHomeRouteByRole(user?.role);
  const initials = getInitials(user?.fullName);

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-[#111116]/90 backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div
          onClick={() => navigate(homeRoute)}
          className="flex h-20 cursor-pointer items-center justify-between border-b border-white/10 px-6 transition hover:opacity-90"
        >
          <Logo />
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
            {user?.role || "Student"}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={20} className={active ? "text-white" : "text-gray-400 group-hover:text-white"} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={16} className="text-white/70" />}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-white/10 p-4 space-y-3">
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 cursor-pointer hover:bg-white/10 transition"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white">{user?.fullName}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= Main Section ================= */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#111116]/80 px-6 backdrop-blur-xl">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl border border-white/10 bg-[#181824] p-2.5 text-gray-300 transition hover:bg-white/10 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                CAMPUSPASS PORTAL
              </p>
              <h2 className="text-lg font-extrabold text-white sm:text-xl">
                Welcome, {user?.fullName?.split(" ")[0]}!
              </h2>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <NotificationBell />

            <div
              onClick={() => navigate("/profile")}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-105"
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Mobile / Tablet Drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="h-full w-72 border-r border-white/10 bg-[#111116] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl border border-white/10 p-2 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {links.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0F] pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#111116]/90 backdrop-blur-2xl lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {links.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all ${
                  active ? "text-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active ? "bg-blue-500/20" : ""
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold">{item.label.split(" ")[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SidebarLayout;