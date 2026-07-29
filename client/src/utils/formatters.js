// Date and currency formatting utilities

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "TBD";

  const defaultOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  if (num === 0) return "Free";
  return `₹${num.toLocaleString("en-IN")}`;
};

export const getInitials = (name) => {
  if (!name) return "CP";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const getStatusStyle = (status) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "published":
    case "active":
    case "confirmed":
    case "approved":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "draft":
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "cancelled":
    case "rejected":
    case "blocked":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "completed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};
