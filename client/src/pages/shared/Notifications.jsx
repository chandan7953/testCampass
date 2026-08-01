import { useEffect, useState } from "react";
import {
  Bell,
  Trash2,
  Calendar,
  CreditCard,
  Ticket,
  ShieldCheck,
  CheckCheck,
  PartyPopper,
  AlertCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import { decrementUnreadCount, resetUnreadCount } from "../../redux/notificationSlice";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { useSocket } from "../../context/SocketContext";
import Pagination from "../../components/Pagination";

const Notifications = () => {
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const socket = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/notifications?page=${pageNum}&limit=10`);
      const newNotifications = response.data.data.notifications || [];
      const pagination = response.data.data.pagination;

      setNotifications(newNotifications);
      setTotalPages(pagination.totalPages || 1);
    } catch {
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      await fetchNotifications(page);
    };
    loadPage();
  }, [page]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      if (page === 1) {
        setNotifications((prev) => {
          // If we prepend, we might exceed limit of 10, but that's fine for real-time. 
          // The user will just see 11 items until they refresh/change page.
          return [notification, ...prev];
        });
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, page]);

  const markAsRead = async (notification) => {
    if (notification.isRead) return;

    try {
      await api.patch(`/notifications/${notification._id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      dispatch(decrementUnreadCount());
    } catch {
      toast.error("Failed to mark notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      dispatch(resetUnreadCount());

      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm("Delete this notification?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      toast.success("Notification deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification);

    if (notification.data?.eventId) {
      navigate(`/event/${notification.data.eventId}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "event":
        return PartyPopper;
      case "booking":
        return Calendar;
      case "payment":
        return CreditCard;
      case "ticket":
        return Ticket;
      case "admin":
        return ShieldCheck;
      case "warning":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        breadcrumb="COMMUNICATION CENTER"
        title="Notifications"
        subtitle="Track bookings, payments, event updates and announcements."
        action={
          notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10"
            >
              <CheckCheck size={16} className="text-blue-400" />
              Mark All Read
            </button>
          )
        }
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You are all caught up. New activity will appear here."
          icon={Bell}
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);

            return (
              <div
                key={notification._id}
                className={`flex gap-4 rounded-3xl border p-5 backdrop-blur-xl transition
                ${notification.isRead ? "border-white/10 bg-[#12121A]/70" : "border-blue-500/40 bg-blue-500/10"}
                `}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Icon size={22} />
                </div>

                <div onClick={() => handleNotificationClick(notification)} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{notification.title}</h3>

                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-gray-300">{notification.message}</p>

                  <p className="mt-2 text-[10px] text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="h-fit rounded-xl p-2 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {totalPages > 1 && (
            <div className="pt-4 pb-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
