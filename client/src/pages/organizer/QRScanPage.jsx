import { useState } from "react";
import { ScanLine, CheckCircle2, XCircle, Search, ShieldCheck, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/formatters";

const QRScanPage = () => {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async (e) => {
    e && e.preventDefault();
    if (!ticketId.trim()) {
      toast.error("Please enter or scan a ticket pass ID");
      return;
    }

    try {
      setLoading(true);
      setVerificationResult(null);

      const res = await api.get(`/bookings/verify/${ticketId.trim()}`);
      setVerificationResult({
        success: true,
        data: res.data.data,
      });
      toast.success("E-Ticket verified successfully!");
    } catch (error) {
      setVerificationResult({
        success: false,
        message: error.response?.data?.message || "Invalid or unverified ticket code.",
      });
      toast.error("Invalid ticket pass code!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        breadcrumb="VENUE ENTRY CHECK-IN"
        title="Live QR E-Ticket Scanner"
        subtitle="Verify student ticket QR passes at the entrance gate and record check-ins."
      />

      {/* Camera Simulator Box */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#181824] to-[#12121A] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="relative mx-auto my-4 flex h-64 w-64 items-center justify-center rounded-3xl border-2 border-dashed border-blue-500/50 bg-black/40">
          {/* Animated Scan Beam */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse shadow-lg shadow-blue-500" />
          
          <div className="flex flex-col items-center space-y-3 p-4">
            <ScanLine size={48} className="text-blue-400 animate-bounce" />
            <p className="text-xs font-semibold text-gray-300">Scanner Beam Active</p>
            <p className="text-[10px] text-gray-500">Position QR pass in front of camera or enter pass code below</p>
          </div>
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleVerify} className="mt-8 flex items-center gap-3">
          <div className="relative flex-1">
            <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Enter Ticket Pass Code (e.g. CP-883921)..."
              className="w-full rounded-2xl border border-white/10 bg-[#12121A] py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
          >
            <Search size={16} />
            <span>{loading ? "Verifying..." : "Verify Pass"}</span>
          </button>
        </form>
      </div>

      {/* Result Verification Card */}
      {verificationResult && (
        <div
          className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
            verificationResult.success
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-rose-500/30 bg-rose-500/10"
          }`}
        >
          {verificationResult.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={28} className="text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-lg font-extrabold text-white">VALID TICKET PASS CONFIRMED</h4>
                  <p className="text-xs text-emerald-300">Grant Entry • Student Verified</p>
                </div>
              </div>

              {verificationResult.data && (
                <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-black/40 p-4 text-xs text-gray-300 border border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Student Name</p>
                    <p className="font-bold text-white text-sm">{verificationResult.data.user?.fullName || "Verified Student"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Pass Quantity</p>
                    <p className="font-bold text-white text-sm">{verificationResult.data.seatsCount || 1} Ticket(s)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Event Title</p>
                    <p className="font-bold text-white">{verificationResult.data.event?.title || "Campus Event"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Status</p>
                    <StatusBadge status={verificationResult.data.status || "confirmed"} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <XCircle size={28} className="text-rose-400 shrink-0" />
              <div>
                <h4 className="text-lg font-extrabold text-white">ENTRY DENIED</h4>
                <p className="text-xs text-rose-300">{verificationResult.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanPage;
