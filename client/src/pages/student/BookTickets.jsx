import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { formatCurrency, formatDate } from "../../utils/formatters";

const BookTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadBookingOptions = async () => {
      try {
        const [eventResponse, ticketsResponse] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/tickets/event/${id}`),
        ]);
        const availableTickets = (ticketsResponse.data.data || []).filter(
          (ticket) => ticket.status === "active" && ticket.remainingQuantity > 0,
        );
        setEvent(eventResponse.data.data);
        setTickets(availableTickets);
        setTicketId(availableTickets[0]?._id || "");
      } catch {
        toast.error("Failed to load booking options");
        navigate("/browse", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    loadBookingOptions();
  }, [id, navigate]);

  const selectedTicket = tickets.find((ticket) => ticket._id === ticketId);
  const maxQuantity = Math.min(5, selectedTicket?.remainingQuantity || 1);
  const total = (selectedTicket?.price || 0) * quantity;

  const selectTicket = (nextTicketId) => {
    setTicketId(nextTicketId);
    setQuantity(1);
  };

  const createBooking = async () => {
    if (!selectedTicket) return;
    try {
      setSubmitting(true);
      const response = await api.post("/bookings", { ticketId, quantity });
      const booking = response.data.data;
      toast.success(booking.paymentStatus === "paid" ? "Your free pass is confirmed!" : "Pass reserved. Continue to payment.");
      navigate(booking.paymentStatus === "paid" ? `/ticket/${booking._id}` : `/payment/${booking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reserve tickets. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-[400px] items-center justify-center text-sm font-semibold text-gray-400">Loading ticket options...</div>;
  if (!event) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"><ArrowLeft size={16} />Back to event</button>
      <PageHeader breadcrumb="RESERVE YOUR PASS" title="Book Event Tickets" subtitle={`Choose a pass for ${event.title}`} />
      {tickets.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#12121A] p-8 text-center text-gray-300">No tickets are currently available for this event.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-5">
          <section className="space-y-6 md:col-span-3 rounded-3xl border border-white/10 bg-[#12121A]/80 p-6">
            <h3 className="border-b border-white/10 pb-3 text-lg font-bold text-white">Choose your pass</h3>
            <div className="space-y-3">
              {tickets.map((ticket) => <button key={ticket._id} type="button" onClick={() => selectTicket(ticket._id)} className={`w-full rounded-2xl border p-4 text-left ${ticketId === ticket._id ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-[#181824]"}`}>
                <div className="flex justify-between gap-4"><div><p className="font-bold text-white">{ticket.title}</p><p className="mt-1 text-xs text-gray-400">{ticket.description || `${ticket.remainingQuantity} passes remaining`}</p></div><p className="font-bold text-blue-400">{formatCurrency(ticket.price)}</p></div>
              </button>)}
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#181824] p-4"><div><p className="font-bold text-white">Quantity</p><p className="text-xs text-gray-400">Maximum 5 passes per booking</p></div><div className="flex items-center gap-3"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} className="rounded-xl border border-white/10 p-2 disabled:opacity-30"><Minus size={16} /></button><span className="w-6 text-center font-bold text-white">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} disabled={quantity === maxQuantity} className="rounded-xl border border-white/10 p-2 disabled:opacity-30"><Plus size={16} /></button></div></div>
            <p className="flex gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-200"><ShieldCheck size={16} />Your QR pass is generated after payment is confirmed.</p>
          </section>
          <aside className="space-y-5 rounded-3xl border border-white/10 bg-[#12121A]/90 p-6 md:col-span-2"><h3 className="border-b border-white/10 pb-3 text-lg font-bold text-white">Booking summary</h3><p className="font-bold text-white">{event.title}</p><p className="flex gap-2 text-xs text-gray-300"><Calendar size={14} className="text-blue-400" />{formatDate(event.startDate)}</p><p className="flex gap-2 text-xs text-gray-300"><MapPin size={14} className="text-blue-400" />{event.venue?.name || "Campus venue"}</p><div className="border-t border-white/10 pt-4"><div className="flex justify-between font-bold text-white"><span>Total</span><span className="text-blue-400">{formatCurrency(total)}</span></div></div><button onClick={createBooking} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white disabled:opacity-50"><Ticket size={18} />{submitting ? "Reserving..." : total === 0 ? "Confirm free pass" : "Proceed to payment"}<ArrowRight size={16} /></button></aside>
        </div>
      )}
    </div>
  );
};

export default BookTickets;
