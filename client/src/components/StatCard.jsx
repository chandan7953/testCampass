const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "from-blue-500 to-indigo-600",
  loading = false,
  subtitle,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5">
      {/* Background Accent Glow */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl transition-all group-hover:opacity-25`} />

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </p>

          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : (
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              {value}
            </h3>
          )}

          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}

          {trend && (
            <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <span>{trend}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon size={26} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
