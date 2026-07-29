import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Pencil,
  Trash2,
  Send,
  Ban,
  Tag,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency } from "../utils/formatters";

const EventCard = ({
  event,
  showActions = false,
  onView,
  onEdit,
  onPublish,
  onCancel,
  onDelete,
}) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "user";

  if (!event) return null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/80 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Poster Header */}
      <div className="relative h-52 w-full overflow-hidden bg-black/40">
        <img
          src={
            event.poster ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
          }
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-black/40" />

        {/* Category Tag */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Tag size={12} className="text-blue-400" />
            {event.category?.name || "Event"}
          </span>
        </div>

        {/* Status Badge */}
        {event.status && (
          <div className="absolute right-4 top-4">
            <StatusBadge status={event.status} />
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 right-4">
          <span className="rounded-xl border border-blue-500/30 bg-blue-600/90 px-3 py-1 text-xs font-extrabold text-white shadow-lg backdrop-blur-md">
            {formatCurrency(event.price)}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {event.description || "Join us for an exciting campus event filled with networking, learning, and fun!"}
          </p>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 border-t border-white/5 pt-3 text-xs text-gray-300">
          <div className="flex items-center gap-2.5">
            <Calendar size={14} className="text-blue-400 shrink-0" />
            <span className="truncate">{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin size={14} className="text-blue-400 shrink-0" />
            <span className="truncate">{event.venue?.name || "Campus Venue TBD"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Users size={14} className="text-blue-400 shrink-0" />
            <span>
              <strong className="text-white">{event.bookedSeats || 0}</strong> / {event.capacity || 100} seats reserved
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions ? (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <button
              onClick={onView}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10"
            >
              <Eye size={14} />
              View
            </button>

            {role === "organizer" && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}

            {role === "admin" && event.status !== "published" && (
              <button
                onClick={onPublish}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <Send size={14} />
                Publish
              </button>
            )}

            {role === "organizer" && event.status === "published" && (
              <button
                onClick={onCancel}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20"
              >
                <Ban size={14} />
                Cancel
              </button>
            )}

            {(role === "organizer" || role === "admin") && (
              <button
                onClick={onDelete}
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20"
              >
                <Trash2 size={14} />
                Delete Event
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onView}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600/90 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500"
          >
            <Eye size={14} />
            Explore Event Details
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;