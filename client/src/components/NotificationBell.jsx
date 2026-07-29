import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadCount } from "../redux/notificationSlice";

const NotificationBell = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { unreadCount } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, user]);

  return (
    <button
      className="relative"
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "20px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/notifications")}
    >
      🔔
      {unreadCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#12121A]"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;