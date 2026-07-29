import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { formatCurrency } from "../../utils/formatters";

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then((response) => {
      const nextBooking = response.data.data;
      if (nextBooking.paymentStatus === "paid") navigate(`/ticket/${bookingId}`, { replace: true });
      else setBooking(nextBooking);
    }).catch(() => {
      toast.error("Unable to load this booking.");
      navigate("/bookings", { replace: true });
    }).finally(() => setLoading(false));
  }, [bookingId, navigate]);

  const startPayment = async () => {
    try {
      setProcessing(true);
      if (!(await loadRazorpay())) throw new Error("Could not load the payment gateway");
      const orderResponse = await api.post("/payments/create-order", { bookingId });
      const order = orderResponse.data.data;
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Payment is not configured. Set VITE_RAZORPAY_KEY_ID in the client environment.");

      const event = booking.eventId || {};
      new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "CampusPass",
        description: event.title || "Event ticket",
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", response);
            toast.success("Payment successful. Your pass is ready!");
            navigate(`/ticket/${bookingId}`, { replace: true });
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        theme: { color: "#2563eb" },
      }).open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to start payment.");
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex min-h-[400px] items-center justify-center text-sm font-semibold text-gray-400">Loading secure checkout...</div>;
  if (!booking) return null;
  const event = booking.eventId || {};
  const amount = booking.totalAmount || 0;

  return <div className="mx-auto max-w-3xl space-y-8"><PageHeader breadcrumb="CHECKOUT & PAYMENT" title="Complete ticket payment" subtitle="Payments are processed securely by Razorpay." /><div className="grid gap-8 md:grid-cols-5"><section className="space-y-4 rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 md:col-span-3"><h3 className="text-lg font-bold text-white">Secure checkout</h3><p className="text-sm leading-relaxed text-gray-300">Select your preferred UPI, card, wallet, or net-banking option in the Razorpay checkout window.</p><p className="flex items-center gap-2 text-xs text-emerald-300"><ShieldCheck size={16} />Your payment details are handled by Razorpay, not CampusPass.</p></section><aside className="space-y-5 rounded-3xl border border-white/10 bg-[#12121A] p-6 md:col-span-2"><h3 className="text-lg font-bold text-white">Order summary</h3><p className="font-bold text-white">{event.title || "Campus event pass"}</p><p className="text-xs text-gray-400">{booking.quantity || 1} ticket(s)</p><div className="flex justify-between border-t border-white/10 pt-4 font-bold text-white"><span>Total</span><span className="text-blue-400">{formatCurrency(amount)}</span></div><button onClick={startPayment} disabled={processing} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white disabled:opacity-50"><CheckCircle2 size={18} />{processing ? "Opening payment..." : `Pay ${formatCurrency(amount)}`}</button></aside></div></div>;
};

export default Payment;
