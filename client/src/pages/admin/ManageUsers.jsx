import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronRight, ShieldCheck, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState("all");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlRole = searchParams.get("role") || "all";
    const urlSearch = searchParams.get("search") || "";

    setPage(urlPage);
    setRole(urlRole);
    setSearch(urlSearch);
    setSearchText(urlSearch);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (role !== "all") params.role = role;

      const res = await api.get("/admin/users", { params });
      const data = res.data.data;

      setUsers(Array.isArray(data.users) ? data.users : []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          totalUsers: 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const params = { page, role };
    if (search.trim()) params.search = search.trim();
    setSearchParams(params, { replace: true });
  }, [page, role, search, setSearchParams]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchText.trim());
  };

  const handleFilter = (selectedRole) => {
    setRole(selectedRole);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="USER MODERATION"
        title="User Management"
        subtitle="View registered students, event organizers, and system admins across CampusPass."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Users", value: "all" },
            { label: "Students", value: "student" },
            { label: "Organizers", value: "organizer" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handleFilter(item.value)}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${role === item.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "border border-white/10 bg-[#181824] text-gray-400 hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name or email..."
              className="w-full sm:w-64 rounded-2xl border border-white/10 bg-[#181824] py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users List Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="There are no user accounts matching your criteria."
          icon={User}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/90 backdrop-blur-xl">
          <div className="divide-y divide-white/5">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/admin/users/${user._id}`)}
                className="group flex cursor-pointer items-center justify-between p-5 transition hover:bg-white/5"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {user.fullName}
                    </h3>
                    <StatusBadge status={user.role} />
                  </div>
                  <p className="text-xs text-gray-400 font-mono truncate">{user.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge status={user.status === "blocked" ? "blocked" : "active"} />
                  <ChevronRight size={18} className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
};

export default ManageUsers;
