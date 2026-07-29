import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Navigation, ArrowLeft, Building2, Compass } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";

const EventMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (error) {
      toast.error("Failed to load venue map");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Venue Location...</p>
      </div>
    );
  }

  if (!event) return null;
  const venue = event.venue || {};

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back to Event
      </button>

      <PageHeader
        breadcrumb="CAMPUS NAVIGATION"
        title="Venue Map & Directions"
        subtitle={`Location guidance for ${event.title}`}
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Simulated Map Visual Card */}
        <div className="md:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#12121A] p-6 shadow-2xl relative space-y-6">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-[#181824] border border-white/5 flex flex-col items-center justify-center">
            {/* Map Grid Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-bounce">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">{venue.name || "Main Campus Auditorium"}</h3>
              <p className="text-xs text-gray-400 max-w-md">{venue.address || "Building B, Central Quadrangle, Pune University Campus"}</p>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(venue.address || venue.name || "Pune")}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Navigation size={16} />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Venue Info Details */}
        <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Building2 size={18} className="text-blue-400" />
            <span>Venue Details</span>
          </h3>

          <div className="space-y-4 text-xs text-gray-300">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Venue Name</p>
              <p className="font-bold text-white text-sm">{venue.name || "Main Auditorium"}</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Capacity</p>
              <p className="font-bold text-white">{venue.capacity || event.capacity || 500} People</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Landmark</p>
              <p className="font-bold text-white">{venue.landmark || "Near University Library"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMap;
