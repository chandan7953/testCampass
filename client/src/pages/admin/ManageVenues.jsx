import { useEffect, useState } from "react";
import { Plus, MapPin, Users, Trash2, Edit, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

const ManageVenues = () => {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/venues");
      setVenues(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch venue locations");
    } finally {
      setLoading(false);
    }
  };

  const deleteVenue = async (id) => {
    if (!window.confirm("Delete this campus venue?")) return;
    try {
      await api.delete(`/venues/${id}`);
      toast.success("Venue deleted");
      fetchVenues();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="CAMPUS INFRASTRUCTURE"
        title="Manage Venues & Locations"
        subtitle="Configure auditorium halls, sports complexes, and lab venues for event hosting."
        action={
          <button
            onClick={() => navigate("/admin/venues/add")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Plus size={18} />
            <span>Add Campus Venue</span>
          </button>
        }
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <EmptyState
          title="No Venues Configured"
          description="Add campus auditoriums and halls so organizers can select them when creating events."
          icon={Building2}
          action={
            <button
              onClick={() => navigate("/admin/venues/add")}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Add Venue
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/90 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-blue-400 transition-colors">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-gray-400">{venue.collegeName || "Main University Campus"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300 border-t border-b border-white/5 py-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{venue.address || "Main Building Block"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-purple-400 shrink-0" />
                  <span>Max Capacity: <strong className="text-white">{venue.capacity || 500} Seats</strong></span>
                </div>
              </div>

              {venue.facilities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {venue.facilities.map((fac, idx) => (
                    <span key={idx} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-gray-300 border border-white/5">
                      {fac}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(`/admin/venues/edit/${venue._id}`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-gray-300 transition hover:bg-white/10"
                >
                  <Edit size={14} />
                  <span>Edit Venue</span>
                </button>
                <button
                  onClick={() => deleteVenue(venue._id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageVenues;