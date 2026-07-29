import { useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  Home,
  Search,
  Calendar,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  ScanLine,
  Menu,
  X,
  Tag,
  Bell,
} from "lucide-react";



import { logout } from "../redux/authSlice";
import NotificationBell from "../components/NotificationBell";
import Logo from "../components/Logo";

const SidebarLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= Active Route Helper ================= */

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const { user } = useSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ================= Logout ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login", {
      replace: true,
    });
  };

  /* ================= Navigation ================= */

  const studentLinks = [
    {
      label: "Home",
      path: "/home",
      icon: Home,
    },
    {
      label: "Browse",
      path: "/browse",
      icon: Search,
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: Calendar,
    },
    {
      label: "Favorites",
      path: "/favorites",
      icon: Heart,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const organizerLinks = [
    {
      label: "Dashboard",
      path: "/organizer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Events",
      path: "/organizer/events",
      icon: ClipboardList,
    },
    {
      label: "Create",
      path: "/organizer/create",
      icon: PlusCircle,
    },
    {
      label: "Attendees",
      path: "/organizer/attendees",
      icon: Users,
    },
    {
      label: "Scanner",
      path: "/organizer/scan/demo",
      icon: ScanLine,
    },
  ];

  

const adminLinks = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    path: "/admin/events",
    icon: ClipboardList,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
];
  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "organizer"
      ? organizerLinks
      : studentLinks;

  const homeRoute =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "organizer"
      ? "/organizer/dashboard"
      : "/home";

  const initials =
    user?.fullName
      ?.split(" ")
      .map((i) => i[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CP";

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">

      {/* ================= Desktop Sidebar ================= */}

      <aside className="hidden w-72 flex-col border-r border-[#202026] bg-[#111116] lg:flex">

        {/* Logo */}

        <div
          onClick={() => navigate(homeRoute)}
          className="flex h-20 cursor-pointer items-center gap-4 border-b border-[#202026] px-6"
        >
          <Logo />
        </div>

        {/* Navigation */}

        <div className="flex-1 px-4 py-6">

          <div className="space-y-2">

            {links.map((item) => {

              const Icon = item.icon;

              const active = isActive(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200

                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-300 hover:bg-[#191920] hover:text-white"
                  }`}
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

          </div>

        </div>

        {/* Logout */}

        <div className="border-t border-[#202026] p-5">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={20} />

            Logout
          </button>

        </div>

      </aside>
            {/* ================= Main Section ================= */}

      <div className="flex flex-1 flex-col">

        {/* ================= Header ================= */}

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#202026] bg-[#111116]/90 px-5 backdrop-blur">

          {/* Left */}

          <div className="flex items-center gap-4">

            {/* Tablet Menu */}

            <button
              onClick={() => setDrawerOpen(true)}
              className="hidden rounded-xl bg-[#191920] p-2 md:block lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>

              <p className="text-xs uppercase tracking-[3px] text-gray-500">
                Welcome Back
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {user?.fullName}
              </h2>

            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-5">

            <NotificationBell/>

            <div
              onClick={() => navigate("/profile")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-sm font-bold"
            >
              {initials}
            </div>

          </div>

        </header>

        {/* ================= Tablet Drawer ================= */}

        {drawerOpen && (

          <div
            className="fixed inset-0 z-50 hidden bg-black/60 md:block lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >

            <div
              className="h-full w-72 bg-[#111116] p-6"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="mb-8 flex items-center justify-between">

                <Logo />

                <button
                  onClick={() => setDrawerOpen(false)}
                >
                  <X />
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
                      className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200

                      ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-[#191920] hover:text-white"
                      }`}
                    >

                      <Icon size={20} />

                      <span className="font-medium">
                        {item.label}
                      </span>

                    </NavLink>

                  );

                })}

              </div>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
              >

                <LogOut size={20} />

                Logout

              </button>

            </div>

          </div>

        )}

        {/* ================= Page Content ================= */}

        <main className="flex-1 overflow-y-auto bg-[#0A0A0F] pb-20 lg:pb-6">

          <div className="p-4 md:p-6 lg:p-8">

            <Outlet />

          </div>

        </main>

      </div>
            {/* ================= Mobile Bottom Navigation ================= */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#111116]/90 backdrop-blur-xl md:hidden lg:hidden">

        <div className="flex h-16 items-center justify-evenly">

          {links.slice(0, 5).map((item) => {

            const Icon = item.icon;

            const active = isActive(item.path);

            return (

              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  active
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    active
                      ? "bg-blue-500/20"
                      : "hover:bg-white/10"
                  }`}
                >

                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                  />

                </div>

                <span className="mt-1 text-[11px] font-medium">
                  {item.label}
                </span>

              </NavLink>

            );

          })}

        </div>

      </nav>

    </div>
  );
};

export default SidebarLayout;