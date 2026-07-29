import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import QRCodeCard from "../../components/QRCodeCard";

const ETicket = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${bookingId}`);
      const data = res.data.data;

      // Guard: if payment is not completed, redirect to payment page
      if (data.paymentStatus !== "paid" && data.totalAmount > 0) {
        toast("Complete payment to view your QR pass", { icon: "💳" });
        navigate(`/payment/${bookingId}`, { replace: true });
        return;
      }

      setBooking(data);
    } catch (error) {
      toast.error("Failed to load digital pass");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Digital Pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 text-center space-y-4">
        <AlertTriangle size={40} className="mx-auto text-amber-400" />
        <h2 className="text-2xl font-bold text-white">Ticket Not Found</h2>
        <p className="text-sm text-gray-400">This pass may not exist or you may not have access to it.</p>
        <button
          onClick={() => navigate("/bookings")}
          className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white"
        >
          My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
          >
            <Printer size={14} />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* QR Pass Document — now with real QR image */}
      <QRCodeCard booking={booking} onDownload={handlePrint} />
    </div>
  );
};

export default ETicket;
