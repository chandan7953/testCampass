import { FolderOpen } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "There are no records matching your request right now.",
  icon: Icon = FolderOpen,
  action,
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#12121A]/40 p-8 text-center backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Icon size={32} />
      </div>

      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
