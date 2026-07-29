import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  Ticket,
  Heart,
  Share2,
  ArrowLeft,
  Map,
  CheckCircle,
  Building2,
  Wifi,
  ParkingCircle,
  Projector,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import EventReviews from "../../components/EventReviews";

import StatusBadge from "../../components/StatusBadge";
import { formatDate, formatCurrency } from "../../utils/formatters";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (user) checkFavoriteStatus();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventRes = await api.get(`/events/${id}`);
      setEvent(eventRes.data.data);

      // Fetch tickets separately — may fail if tickets don't exist yet
      try {
        const ticketsRes = await api.get(`/tickets/event/${id}`);
        const tickets = ticketsRes.data.data || [];

        if (tickets.length > 0) {
          // Ticket system exists — count available from ticket records
          const seats = tickets.reduce(
            (total, t) => total + (t.status === "active" ? t.remainingQuantity : 0),
            0
          );
          setAvailableSeats(seats);
        } else {
          // No tickets created yet — fall back to event capacity
          setAvailableSeats(null);
        }
      } catch {
        // Ticket fetch failed — fall back to capacity-based estimate
        setAvailableSeats(null);
      }
    } catch (error) {
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const res = await api.get("/users/favorites");
      const favList = res.data.data || [];
      setIsFavorite(favList.some((fav) => fav.event?._id === id || fav.event === id));
    } catch {
      // Silent
    }
  };

  const toggleFavorite = async () => {
    try {
      setSavingFav(true);
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/users/favorites/${id}`);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setSavingFav(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Event Details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-sm text-gray-400">The event you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const venue = event.venue || {};
  const seatsAvailable = availableSeats !== null ? availableSeats : (event.capacity || 0) - (event.bookedSeats || 0);
  const isBookable = user?.role === "student" && event.status === "approved" && seatsAvailable > 0;

  return (
    <div className="space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2.5 text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Events
        </button>

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={toggleFavorite}
              disabled={savingFav}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition ${
                isFavorite
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                  : "border-white/10 bg-[#12121A] text-gray-300 hover:bg-white/10"
              }`}
            >
              <Heart size={16} className={isFavorite ? "fill-rose-400" : ""} />
              {isFavorite ? "Saved" : "Save Event"}
            </button>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Event link copied to clipboard!");
            }}
            className="rounded-2xl border border-white/10 bg-[#12121A] p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121A] shadow-2xl backdrop-blur-xl">
        <div className="relative h-80 w-full overflow-hidden sm:h-96">
          <img
            src={
              event.poster ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
            }
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-[#12121A]/50 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <span className="rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Tag size={12} className="mr-1.5 inline text-blue-400" />
              {event.category?.name || "Campus Fest"}
            </span>
            <StatusBadge status={event.status || "pending"} />
          </div>
        </div>

        {/* Header Details */}
        <div className="relative -mt-16 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <p className="text-sm font-semibold text-blue-400">
                Organized by: {event.organizer?.fullName || "Campus Student Council"}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-blue-500/30 bg-blue-600/20 p-4 text-center backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Ticket Price</p>
              <p className="text-3xl font-black text-white">{formatCurrency(event.price)}</p>
            </div>
          </div>

          {/* Action Row — only for students on approved events */}
          {user?.role === "student" && event.status === "approved" && (
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
              <button
                onClick={() => navigate(`/event/${event._id || event.id}/book`)}
                disabled={seatsAvailable <= 0}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Ticket size={20} />
                <span>{seatsAvailable > 0 ? "Book Pass Now" : "Sold Out"}</span>
              </button>

              {venue.latitude && venue.longitude && (
                <button
                  onClick={() => navigate(`/event/${event._id || event.id}/map`)}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <Map size={18} />
                  <span>View Venue Map</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 cols */}
        <div className="space-y-8 lg:col-span-2">
          {/* About Event */}
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">About This Event</h3>
            <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">
              {event.description || "Join us for an incredible campus experience!"}
            </p>
          </div>

          {/* Guidelines */}
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">Guidelines & Details</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>E-Ticket QR pass is required at the venue entrance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>College Student ID Card must be produced alongside your ticket.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Please report 15 minutes prior to the scheduled start time.</span>
              </li>
              {event.registrationDeadline && (
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Registration closes: {formatDate(event.registrationDeadline)}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* Event Logistics */}
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Event Logistics</h3>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Date</p>
                  <p className="font-bold text-white">{formatDate(event.startDate)}</p>
                  {event.endDate && event.endDate !== event.startDate && (
                    <p className="text-xs text-gray-500 mt-0.5">to {formatDate(event.endDate)}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Time</p>
                  <p className="font-bold text-white">
                    {new Date(event.startDate || Date.now()).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Availability</p>
                  <p className="font-bold text-white">
                    {seatsAvailable > 0 ? `${seatsAvailable} seats remaining` : "Fully Booked"}
                  </p>
                  {event.capacity && (
                    <p className="text-xs text-gray-500 mt-0.5">Total capacity: {event.capacity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details Card */}
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Building2 size={18} className="text-blue-400" />
              Venue Details
            </h3>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">{venue.name || "Campus Auditorium"}</p>
                  {venue.address && <p className="text-xs text-gray-400 mt-0.5">{venue.address}</p>}
                </div>
              </div>

              {venue.collegeName && (
                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Institution</p>
                    <p className="font-bold text-white">{venue.collegeName}</p>
                  </div>
                </div>
              )}

              {venue.capacity && (
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Venue Capacity</p>
                    <p className="font-bold text-white">{venue.capacity} seats</p>
                  </div>
                </div>
              )}

              {/* Venue Facilities */}
              {venue.facilities && venue.facilities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Facilities Available</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities.map((facility, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-300"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventReviews eventId={id} user={user} />
    </div>
  );
};

export default EventDetail;
