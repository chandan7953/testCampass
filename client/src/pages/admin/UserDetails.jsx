import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, Shield, ShieldCheck, UserCog } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/${id}`);
      const userData = res.data.data;
      setUser(userData);
      setRole(userData.role);
    } catch (error) {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      setSaving(true);
      await api.patch(`/admin/users/${id}/role`, { role });
      toast.success("User role updated!");
      fetchUser();
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const handleBlockToggle = async () => {
    try {
      setSaving(true);
      const endpoint = user.status === "blocked" ? `/admin/users/${id}/unblock` : `/admin/users/${id}/block`;
      await api.patch(endpoint);
      toast.success(user.status === "blocked" ? "User unblocked" : "User blocked");
      fetchUser();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading User Profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back to Users List
      </button>

      <PageHeader
        breadcrumb="USER DETAILS"
        title={user.fullName}
        subtitle={`Account Management for ${user.email}`}
      />

      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/30 via-[#12121A] to-[#12121A] p-6 backdrop-blur-xl md:p-8 space-y-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-xl">
            {user.fullName?.substring(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-white">{user.fullName}</h2>
            <p className="text-xs text-gray-400 font-mono">{user.email}</p>
            <div className="flex items-center justify-center gap-2 sm:justify-start pt-1">
              <StatusBadge status={user.role} />
              <StatusBadge status={user.status === "blocked" ? "blocked" : "active"} />
            </div>
          </div>
        </div>
      </div>

      {/* Role and Block Controls */}
      <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <UserCog size={18} className="text-blue-400" />
          <span>Admin Moderation Controls</span>
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase">Change Account Role</label>
            <div className="flex gap-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleRoleUpdate}
                disabled={saving}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase">Account Status Action</label>
            <button
              onClick={handleBlockToggle}
              disabled={saving}
              className={`w-full rounded-2xl py-3 text-xs font-bold transition shadow-lg ${
                user.status === "blocked"
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-rose-600 text-white hover:bg-rose-500"
              } disabled:opacity-50`}
            >
              {user.status === "blocked" ? "Unblock Account Access" : "Block User Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
