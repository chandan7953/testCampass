import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Calendar, CreditCard, Ticket, ShieldCheck, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "payment":
        return CreditCard;
      case "ticket":
        return Ticket;
      case "admin":
        return ShieldCheck;
      default:
        return Bell;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        breadcrumb="COMMUNICATION CENTER"
        title="Notifications & Activity"
        subtitle="Stay informed on ticket reservations, venue updates, and announcements."
        action={
          notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2.5 text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <CheckCheck size={16} className="text-blue-400" />
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You're all caught up! You will receive alerts when your tickets are confirmed or venue details change."
          icon={Bell}
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);

            return (
              <div
                key={notification._id}
                className={`flex items-start gap-4 rounded-3xl border border-white/10 bg-[#12121A]/80 p-5 backdrop-blur-xl transition hover:bg-white/10 ${!notification.isRead ? "border-l-4 border-l-blue-500" : ""
                  }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Icon size={22} />
                </div>

                <div
                  className="flex-1 cursor-pointer space-y-1"
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{notification.message}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="rounded-xl p-2 text-rose-400 transition hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;