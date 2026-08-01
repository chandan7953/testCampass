import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, CalendarDays, IndianRupee, Ticket, ArrowRight, Tag } from "lucide-react";

import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

import { formatCurrency } from "../../utils/formatters";

const quickActions = [
  {
    id: 1,
    icon: CalendarDays,
    label: "Manage All Events",
    desc: "Approve, publish, reject or delete events",
    path: "/admin/events",
    color: "from-primary to-emerald-400",
  },

  {
    id: 2,
    icon: Users,
    label: "Manage Users",
    desc: "Inspect, block or unblock system users",
    path: "/admin/users",
    color: "from-purple-500 to-pink-500",
  },

  {
    id: 3,
    icon: Building2,
    label: "Campus Venues",
    desc: "Add or edit university venue locations",
    path: "/admin/venues",
    color: "from-emerald-500 to-teal-500",
  },

  {
    id: 4,
    icon: Tag,
    label: "Event Categories",
    desc: "Configure event category tags",
    path: "/admin/categories",
    color: "from-amber-500 to-orange-500",
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

        totalUsers: data.totalUsers > 0 ? data.totalUsers - 1 : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="SYSTEM ADMINISTRATION"
        title="Admin Control Overview"
        subtitle="Executive dashboard for university event management, organizer oversight, and revenue statistics."
      />

      {/* Statistics */}

      <div
        className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-5
"
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-primary to-emerald-400"
          loading={loading}
        />

        <StatCard
          title="Organizers"
          value={stats.totalOrganizers}
          icon={Building2}
          color="from-amber-500 to-orange-500"
          loading={loading}
        />

        <StatCard
          title="All Events"
          value={stats.totalEvents}
          icon={CalendarDays}
          color="from-purple-500 to-pink-500"
          loading={loading}
        />

        <StatCard
          title="Bookings"
          value={stats.totalBookings}
          icon={Ticket}
          color="from-indigo-500 to-violet-500"
          loading={loading}
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={IndianRupee}
          color="from-emerald-500 to-teal-500"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}

      <div className="space-y-5">
        <h2
          className="
text-xl
font-extrabold
text-text
"
        >
          Administrative Actions
        </h2>

        <div
          className="
grid
gap-6
md:grid-cols-2
lg:grid-cols-4
"
        >
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className="

group
relative
cursor-pointer
overflow-hidden
rounded-3xl
border
border-border
bg-surface/80
p-6
backdrop-blur-xl
transition-all
duration-300

hover:-translate-y-1
hover:border-primary/40
hover:shadow-xl

"
              >
                {/* Icon */}

                <div
                  className={`

flex
h-14
w-14
items-center
justify-center
rounded-2xl

bg-gradient-to-br
${item.color}

text-white
shadow-lg

`}
                >
                  <Icon size={26} />
                </div>

                <h3
                  className="

mt-5
text-lg
font-bold
text-text

group-hover:text-primary
transition

"
                >
                  {item.label}
                </h3>

                <p
                  className="
mt-2
text-xs
leading-relaxed
text-text-muted
"
                >
                  {item.desc}
                </p>

                <div
                  className="
mt-6
flex
items-center
gap-2
text-xs
font-bold
text-primary
"
                >
                  <span>Open Control</span>

                  <ArrowRight
                    size={14}
                    className="
transition
group-hover:translate-x-1
"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
