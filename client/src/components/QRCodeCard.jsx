import { Ticket, Calendar, MapPin, CheckCircle2, Download, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/formatters";

const QRCodeCard = ({ booking, onDownload }) => {
  if (!booking) return null;

  const event = booking.eventId || booking.event || {};
  const bookingCode = booking.bookingCode || booking._id || "CP-000000";
  const isPaid = booking.paymentStatus === "paid";

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#181824] to-[#111118] p-6 shadow-2xl backdrop-blur-xl md:p-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Ticket className="text-blue-500" size={24} />
          <span className="font-extrabold tracking-wider text-white">CAMPUSPASS</span>
        </div>
        <StatusBadge status={booking.bookingStatus || "pending"} />
      </div>

      {/* QR Code */}
      <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        {booking.qrCode ? (
          /* Real QR code from backend (base64 data URL) */
          <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2 shadow-inner">
            <img
              src={booking.qrCode}
              alt={`QR Pass — ${bookingCode}`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          /* Fallback when QR is missing */
          <div className="flex h-48 w-48 flex-col items-center justify-center rounded-xl bg-white/10 text-center">
            <AlertTriangle size={32} className="mb-2 text-amber-400" />
            <p className="text-xs font-semibold text-gray-300">QR unavailable</p>
            <p className="mt-1 text-[10px] text-gray-500">Contact support</p>
          </div>
        )}

        <p className="mt-4 font-mono text-xs font-semibold tracking-widest text-blue-400 uppercase">
          PASS ID: {bookingCode}
        </p>

        {!isPaid && (
          <p className="mt-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-300">
            Payment Pending — QR active after payment
          </p>
        )}
      </div>

      {/* Event Details */}
      <div className="space-y-4 rounded-2xl border border-white/5 bg-black/30 p-4">
        <div>
          <h4 className="text-lg font-bold text-white line-clamp-1">
            {event.title || "Campus Event"}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Category: {event.category?.name || "General"}
          </p>
        </div>

        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-400" />
            <span>{formatDate(event.startDate || new Date())}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-400" />
            <span className="truncate">{event.venue?.name || "Campus Venue"}</span>
          </div>

          {event.venue?.address && (
            <p className="pl-[22px] text-[11px] text-gray-500">{event.venue.address}</p>
          )}

          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>{booking.quantity || 1} Ticket(s)</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onDownload && isPaid && (
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
