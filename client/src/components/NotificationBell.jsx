import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const navigate = useNavigate();
  return (
    <button
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
    </button>
  );
};

export default NotificationBell;