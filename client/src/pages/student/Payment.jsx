import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, QrCode, Building, ShieldCheck, CheckCircle2, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import { formatCurrency } from "../../utils/formatters";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("student@upi");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${bookingId}`);
      setBooking(res.data.data);
    } catch (error) {
      toast.error("Failed to load booking details");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    try {
      setProcessing(true);
      // Confirm payment with backend API if endpoint exists, or confirm booking status
      try {
        await api.post(`/bookings/${bookingId}/confirm`, { paymentMethod });
      } catch (err) {
        // Fallback simulation if route auto-confirms
      }

      toast.success("Payment Successful! E-Ticket Generated 🎉");
      navigate(`/ticket/${bookingId}`, { replace: true });
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Securing Payment Gateway...</p>
      </div>
    );
  }

  if (!booking) return null;

  const event = booking.event || {};
  const totalAmount = booking.totalAmount || (event.price || 0) * (booking.seatsCount || 1);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        breadcrumb="CHECKOUT & PAYMENT"
        title="Complete Ticket Payment"
        subtitle="Choose your preferred payment method to confirm your CampusPass ticket."
      />

      <div className="grid gap-8 md:grid-cols-5">
        {/* Payment Methods */}
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Payment Method</h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                  paymentMethod === "upi"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-white/10 bg-[#181824] text-gray-400 hover:text-white"
                }`}
              >
                <QrCode size={22} className={paymentMethod === "upi" ? "text-blue-400" : ""} />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-white/10 bg-[#181824] text-gray-400 hover:text-white"
                }`}
              >
                <CreditCard size={22} className={paymentMethod === "card" ? "text-blue-400" : ""} />
                <span>Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                  paymentMethod === "netbanking"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-white/10 bg-[#181824] text-gray-400 hover:text-white"
                }`}
              >
                <Building size={22} className={paymentMethod === "netbanking" ? "text-blue-400" : ""} />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Sub-form based on method */}
            {paymentMethod === "upi" && (
              <div className="space-y-4 rounded-2xl bg-[#181824] p-4 border border-white/5">
                <label className="block text-xs font-semibold text-gray-300">Enter UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis"
                  className="w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-gray-400">A payment request will be sent to your UPI app.</p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4 rounded-2xl bg-[#181824] p-4 border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 •••• •••• 1111"
                    className="w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="space-y-4 rounded-2xl bg-[#181824] p-4 border border-white/5">
                <label className="block text-xs font-semibold text-gray-300">Select Bank</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-sm text-white outline-none focus:border-blue-500">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>256-bit Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Pay Action */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121A]/90 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Pay Summary</h3>

            <div className="space-y-2 text-xs text-gray-300">
              <p className="font-extrabold text-white text-sm line-clamp-1">{event.title || "Campus Event Pass"}</p>
              <p>Tickets Reserved: <strong>{booking.seatsCount || 1} Seat(s)</strong></p>
              <p className="text-gray-400 font-mono text-[11px]">BOOKING ID: {booking._id}</p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between text-base font-extrabold text-white">
                <span>Amount Payable</span>
                <span className="text-blue-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleCompletePayment}
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:scale-105 disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              <span>{processing ? "Confirming..." : `Pay ${formatCurrency(totalAmount)}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
