import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Ticket, MapPin, Eye, QrCode, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatCurrency } from "../../utils/formatters";

const MyBookings = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "confirmed" | "completed" | "cancelled"

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load your event passes");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return (b.status || "").toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="MY DIGITAL PASSES"
        title="My Bookings & E-Tickets"
        subtitle="Manage your reserved event passes, view digital QR codes, or access ticket details."
      />

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
        {[
          { key: "all", label: `All Passes (${bookings.length})` },
          { key: "confirmed", label: "Confirmed" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-white/10 bg-[#12121A] text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description="You haven't reserved any event tickets in this category yet. Discover exciting events happening on campus!"
          icon={Ticket}
          action={
            <button
              onClick={() => navigate("/browse")}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Browse Events Now
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBookings.map((booking) => {
            const event = booking.event || {};
            return (
              <div
                key={booking._id || booking.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/90 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <StatusBadge status={booking.status || "confirmed"} />
                    <h3 className="text-lg font-bold text-white line-clamp-1 mt-2">
                      {event.title || "Campus Event"}
                    </h3>
                  </div>

                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                    {booking.seatsCount || 1} Seat(s)
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-300 border-t border-b border-white/5 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-400" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-400" />
                    <span className="truncate">{event.venue?.name || "Campus Main Venue"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Paid Amount</p>
                    <p className="text-base font-extrabold text-white">
                      {formatCurrency(booking.totalAmount || event.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/ticket/${booking._id || booking.id}`)}
                    className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                  >
                    <QrCode size={16} />
                    <span>View Pass QR</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
