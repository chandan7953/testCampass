import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ticket, Minus, Plus, Calendar, MapPin, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import { formatDate, formatCurrency } from "../../utils/formatters";

const BookTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [seatsCount, setSeatsCount] = useState(1);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (error) {
      toast.error("Failed to load event for booking");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    try {
      setSubmitting(true);
      const res = await api.post("/bookings", {
        eventId: id,
        seatsCount,
      });

      const booking = res.data.data;
      toast.success("Booking initiated! Proceeding to checkout...");
      navigate(`/payment/${booking._id || booking.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Ticket Options...</p>
      </div>
    );
  }

  if (!event) return null;

  const unitPrice = Number(event.price) || 0;
  const totalPrice = unitPrice * seatsCount;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back to Event Details
      </button>

      <PageHeader
        breadcrumb="RESERVE YOUR PASS"
        title="Book Event Tickets"
        subtitle={`Select ticket quantity for ${event.title}`}
      />

      <div className="grid gap-8 md:grid-cols-5">
        {/* Left 3 cols: Selection Form */}
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Select Ticket Quantity</h3>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#181824] p-4">
              <div>
                <p className="font-extrabold text-white text-base">Standard Pass</p>
                <p className="text-xs text-gray-400">{formatCurrency(unitPrice)} / ticket</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSeatsCount((prev) => Math.max(1, prev - 1))}
                  disabled={seatsCount <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-lg font-extrabold text-white">{seatsCount}</span>
                <button
                  onClick={() => setSeatsCount((prev) => Math.min(5, prev + 1))}
                  disabled={seatsCount >= 5}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20 text-xs text-blue-300">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                <span>Verified E-Ticket with Anti-Duplication QR Pass</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Maximum 5 tickets allowed per student registration. Free instant cancellation available up to 24 hours prior.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Summary Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/90 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Booking Summary</h3>

            <div className="space-y-3 text-xs text-gray-300">
              <p className="font-extrabold text-white text-sm line-clamp-1">{event.title}</p>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-400" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                <span className="truncate">{event.venue?.name || "Campus Auditorium"}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Pass Price ({seatsCount}x)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Processing Fee</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-blue-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
            >
              <Ticket size={18} />
              <span>{submitting ? "Processing..." : "Proceed to Checkout"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTickets;
