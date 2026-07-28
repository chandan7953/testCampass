import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Users,
  Building2,
  CalendarDays,
  IndianRupee,
  Ticket,
  ArrowRight,
} from "lucide-react";

const quickActions = [
  {
    id: 1,
    icon: "📋",
    label: "Manage All Events",
    desc: "Approve, reject or delete events",
    path: "/admin/events",
  },
  {
    id: 2,
    icon: "👥",
    label: "Manage Users",
    desc: "Block or unblock users",
    path: "/admin/users",
  },
  {
    id: 3,
    icon: "🏢",
    label: "Organizers",
    desc: "Manage organizers",
    path: "/admin/organizers",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    setLoading(true);

    const res = await api.get("/admin/dashboard");

    const data = res.data.data;

    setStats({
      ...data,
      totalUsers:
        data.totalUsers > 0
          ? data.totalUsers - 1
          : 0,
    });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Organizers",
      value: stats.totalOrganizers,
      icon: Building2,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      icon: CalendarDays,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: Ticket,
      color: "from-indigo-500 to-violet-500",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: IndianRupee,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-white">
                    {loading ? "--" : card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r ${card.color}`}
                >
                  <Icon size={28} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}

      <div>
        <h2 className="mb-5 text-xl font-semibold text-white">
          Quick Actions
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10"
            >
              <div className="text-4xl">{item.icon}</div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {item.label}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {item.desc}
              </p>

              <div className="mt-6 flex items-center gap-2 text-blue-400">
                Open
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;