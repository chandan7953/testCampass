import { useEffect, useMemo, useState } from "react";
import { PlusCircle, ClipboardList, CheckCircle2, AlertCircle, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";
import EventCard from "../../components/EventCard";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import SearchFilterBar from "../../components/SearchFilterBar";
import EmptyState from "../../components/EmptyState";

const ManageEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/organizer/my-events");
      setEvents(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };



  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const searchMatch =
        evt.title?.toLowerCase().includes(search.toLowerCase()) ||
        evt.description?.toLowerCase().includes(search.toLowerCase());
      const statusMatch = !statusFilter || evt.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [events, search, statusFilter]);


  const total = events.length;
  const published = events.filter((e) => e.status === "approved").length;
  const draft = events.filter((e) => e.status === "pending").length;
  const cancelled = events.filter((e) => e.status === "rejected").length;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="ORGANIZER PORTAL"
        title="Manage My Events"
        subtitle="Publish, edit, or track attendance for all your hosted campus events."
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

      {/* KPI Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={total} icon={ClipboardList} color="from-blue-500 to-indigo-600" />
        <StatCard title="Published Live" value={published} icon={CheckCircle2} color="from-emerald-500 to-teal-500" />
        <StatCard title="Draft Stage" value={draft} icon={AlertCircle} color="from-amber-500 to-orange-500" />
        <StatCard title="Cancelled" value={cancelled} icon={Ban} color="from-rose-500 to-pink-500" />
      </div>

      {/* Search & Status Filter Bar */}
      <SearchFilterBar
        searchTerm={search}
        onSearchChange={setSearch}
        statusOptions={[
          { value: "published", label: "Published Live" },
          { value: "draft", label: "Draft Stage" },
          { value: "cancelled", label: "Cancelled" },
        ]}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        placeholder="Filter your organized events..."
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="There are no events matching your current search or status filter."
          icon={ClipboardList}
          action={
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt._id || evt.id}
              event={evt}
              showActions
              onView={() => navigate(`/organizer/events/${evt._id || evt.id}`)}
              onEdit={() => navigate(`/organizer/events/edit/${evt._id || evt.id}`)}
              onDelete={() => deleteEvent(evt._id || evt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;