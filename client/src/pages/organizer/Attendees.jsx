import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, CheckCircle2, XCircle, Search, Download, ArrowLeft, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/formatters";

const Attendees = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    } else if (events.length > 0) {
      setSelectedEventId(events[0]._id || events[0].id);
      fetchAttendees(events[0]._id || events[0].id);
    } else {
      setLoading(false);
    }
  }, [selectedEventId, events]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/my-events");
      const list = res.data.data || [];
      setEvents(list);
      if (!selectedEventId && list.length > 0) {
        setSelectedEventId(list[0]._id || list[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendees = async (eId) => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/event/${eId}`);
      setAttendees(res.data.data || []);
    } catch (error) {
      // Fallback empty list
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInToggle = async (bookingId, currentCheckIn) => {
    try {
      await api.patch(`/bookings/${bookingId}/check-in`, { checkedIn: !currentCheckIn });
      toast.success(currentCheckIn ? "Check-in undone" : "Attendee checked in!");
      fetchAttendees(selectedEventId);
    } catch (error) {
      toast.error("Failed to update check-in status");
    }
  };

  const filteredAttendees = attendees.filter((item) => {
    const user = item.user || {};
    const nameMatch = user.fullName?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(search.toLowerCase());
    const codeMatch = (item.bookingCode || item._id || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || codeMatch;
  });

  const exportCSV = () => {
    if (filteredAttendees.length === 0) return toast.error("No attendees to export");
    const headers = ["Booking Code,Full Name,Email,Mobile,Seats,Status,Checked In\n"];
    const rows = filteredAttendees.map((a) => {
      const u = a.user || {};
      return `"${a.bookingCode || a._id}","${u.fullName || ""}","${u.email || ""}","${u.mobile || ""}","${a.seatsCount || 1}","${a.status || "confirmed"}","${a.checkedIn ? "Yes" : "No"}"\n`;
    });

    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendees_${selectedEventId}.csv`;
    link.click();
    toast.success("Attendee list exported to CSV!");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="ATTENDEE MANAGEMENT"
        title="Event Attendees & Check-In"
        subtitle="Track registered students, verify E-Tickets, and update check-in status live."
        action={
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Select Event Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase">Select Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#181824] px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-blue-500"
          >
            {events.map((evt) => (
              <option key={evt._id || evt.id} value={evt._id || evt.id}>
                {evt.title} ({evt.bookedSeats || 0} attendees)
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or ticket code..."
            className="w-full sm:w-64 rounded-2xl border border-white/10 bg-[#181824] py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Attendees Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : filteredAttendees.length === 0 ? (
        <EmptyState
          title="No Attendees Registered"
          description="There are no registered students matching your search criteria for this event."
          icon={Users}
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#12121A]/90 backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-black/40 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Pass Code</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Seats</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Check-In Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filteredAttendees.map((item) => {
                const user = item.user || {};
                return (
                  <tr key={item._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-400">
                      {item.bookingCode || item._id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{user.fullName || "Student Name"}</p>
                      <p className="text-[11px] text-gray-400">{user.email || "student@college.edu"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1.5 text-gray-300">
                        <Phone size={12} className="text-gray-400" />
                        <span>{user.mobile || "N/A"}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {item.seatsCount || 1} Seat(s)
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status || "confirmed"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCheckInToggle(item._id, item.checkedIn)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                          item.checkedIn
                            ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                            : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {item.checkedIn ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Checked In</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Check In</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendees;
