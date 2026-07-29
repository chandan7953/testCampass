import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, Shield, KeyRound, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { loginSuccess } from "../../redux/authSlice";
import { getInitials } from "../../utils/formatters";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/users/profile", profileForm);
      const updatedUser = res.data.data;

      dispatch(loginSuccess({ token, user: updatedUser }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in both current and new password");
      return;
    }
    try {
      setSaving(true);
      await api.put("/users/change-password", passwordForm);
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(user?.fullName);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        breadcrumb="ACCOUNT & SETTINGS"
        title="Profile Settings"
        subtitle="Manage your profile information, password, and system privileges."
      />

      {/* User Info Overview Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/40 via-[#12121A] to-[#12121A] p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-blue-600/30">
            {initials}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h2 className="text-2xl font-extrabold text-white">{user?.fullName}</h2>
              <StatusBadge status={user?.role || "student"} />
            </div>
            <p className="text-xs text-gray-400 font-mono">{user?.email}</p>
            <p className="text-xs text-gray-400">
              Account Status: <span className="text-emerald-400 font-semibold">Active & Verified</span>
            </p>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Edit Personal Info */}
        <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <User size={18} className="text-blue-400" />
            <span>Personal Information</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-2xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-[10px] text-gray-500">Email cannot be modified.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mobile Number</label>
              <input
                type="text"
                value={profileForm.mobile}
                onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <KeyRound size={18} className="text-blue-400" />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <KeyRound size={16} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
