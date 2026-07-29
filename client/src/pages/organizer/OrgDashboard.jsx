import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, PlusCircle, Users, IndianRupee, Ticket, ArrowRight, ScanLine } from "lucide-react";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import EventCard from "../../components/EventCard";
import EmptyState from "../../components/EmptyState";
import { formatCurrency } from "../../utils/formatters";

const OrgDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/my-events");
      const myEvents = res.data.data || [];
      setEvents(myEvents);

      let totalBookings = 0;
      let totalRevenue = 0;

      myEvents.forEach((evt) => {
        const booked = Number(evt.bookedSeats) || 0;
        const price = Number(evt.price) || 0;
        totalBookings += booked;
        totalRevenue += booked * price;
      });

      setStats({
        totalEvents: myEvents.length,
        totalBookings,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching organizer dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="ORGANIZER CONTROL CENTER"
        title="Organizer Dashboard"
        subtitle="Manage your campus event registrations, monitor seat bookings, and issue passes."
        action={
          <button
            onClick={() => navigate("/organizer/create")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <PlusCircle size={18} />
            <span>Create New Event</span>
          </button>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="My Organized Events"
          value={stats.totalEvents}
          icon={ClipboardList}
          color="from-blue-500 to-cyan-500"
          loading={loading}
        />

        <StatCard
          title="Total Tickets Reserved"
          value={stats.totalBookings}
          icon={Ticket}
          color="from-purple-500 to-indigo-500"
          loading={loading}
        />

        <StatCard
          title="Estimated Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={IndianRupee}
          color="from-emerald-500 to-teal-500"
          loading={loading}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div
          onClick={() => navigate("/organizer/create")}
          className="group flex cursor-pointer items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <PlusCircle size={22} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Host New Event</p>
              <p className="text-xs text-gray-400">Add dates, tickets & venue</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-400" />
        </div>

        <div
          onClick={() => navigate("/organizer/attendees")}
          className="group flex cursor-pointer items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <Users size={22} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Attendee List</p>
              <p className="text-xs text-gray-400">Check registrations & status</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-400" />
        </div>

        <div
          onClick={() => navigate("/organizer/scan/demo")}
          className="group flex cursor-pointer items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <ScanLine size={22} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">QR Ticket Scanner</p>
              <p className="text-xs text-gray-400">Validate E-Tickets live</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-400" />
        </div>
      </div>

      {/* Recent Organizer Events Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white">Your Events</h2>
          <button
            onClick={() => navigate("/organizer/events")}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            <span>Manage All ({events.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-80 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No Events Created Yet"
            description="Start hosting campus fests, workshops, or tournaments by creating your first event!"
            action={
              <button
                onClick={() => navigate("/organizer/create")}
                className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
              >
                Create Event
              </button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((evt) => (
              <EventCard
                key={evt._id || evt.id}
                event={evt}
                showActions
                onView={() => navigate(`/event/${evt._id || evt.id}`)}
                onEdit={() => navigate(`/organizer/events/edit/${evt._id || evt.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDashboard;
