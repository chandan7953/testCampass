import { Search, SlidersHorizontal, X } from "lucide-react";

const SearchFilterBar = ({
  searchTerm = "",
  onSearchChange,
  categories = [],
  selectedCategory = "",
  onCategoryChange,
  statusOptions = [],
  selectedStatus = "",
  onStatusChange,
  placeholder = "Search events, venues, organizers...",
  extraActions,
}) => {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#12121A]/60 p-4 backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-white/10 bg-[#181824] py-3.5 pl-12 pr-10 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm font-medium text-gray-200 outline-none transition hover:border-white/20 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id || cat.name} value={cat._id || cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          {statusOptions.length > 0 && (
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm font-medium text-gray-200 outline-none transition hover:border-white/20 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((st) => (
                <option key={st.value || st} value={st.value || st}>
                  {st.label || st}
                </option>
              ))}
            </select>
          )}

          {extraActions}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
