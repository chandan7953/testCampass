import { Ticket, Calendar, MapPin, CheckCircle2, Download } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/formatters";

const QRCodeCard = ({ booking, onDownload }) => {
  if (!booking) return null;

  const event = booking.event || {};
  const bookingCode = booking.bookingCode || booking._id || "CP-883921";

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#181824] to-[#111118] p-6 shadow-2xl backdrop-blur-xl md:p-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Ticket className="text-blue-500" size={24} />
          <span className="font-extrabold tracking-wider text-white">CAMPUSPASS</span>
        </div>
        <StatusBadge status={booking.status || "confirmed"} />
      </div>

      {/* QR Code Graphic Placeholder */}
      <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="relative flex h-44 w-44 items-center justify-center rounded-xl bg-white p-3 shadow-inner">
          {/* Stylized Simulated QR Code Grid */}
          <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${
                  (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24)
                    ? "bg-black"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="mt-4 font-mono text-xs font-semibold tracking-widest text-blue-400 uppercase">
          PASS ID: {bookingCode}
        </p>
      </div>

      {/* Event Details */}
      <div className="space-y-4 rounded-2xl border border-white/5 bg-black/30 p-4">
        <div>
          <h4 className="text-lg font-bold text-white line-clamp-1">
            {event.title || "Campus Tech Fest 2026"}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Category: {event.category?.name || "Workshop & Tech"}
          </p>
        </div>

        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-400" />
            <span>{formatDate(event.startDate || new Date())}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-400" />
            <span className="truncate">{event.venue?.name || "Main Auditorium, Block C"}</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Seats: {booking.seatsCount || booking.quantity || 1} Ticket(s)</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/30"
        >
          <Download size={18} />
          Download E-Ticket Pass
        </button>
      )}
    </div>
  );
};

export default QRCodeCard;
