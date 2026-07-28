import { useCallback, useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Search } from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/axios";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";

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

  // Load URL params initially

  useEffect(() => {
  const urlPage = Number(searchParams.get("page")) || 1;

  const urlRole = searchParams.get("role") || "all";

  const urlSearch = searchParams.get("search") || "";

  setPage(urlPage);

  setRole(urlRole);

  setSearch(urlSearch);

  setSearchText(urlSearch);
}, []);

  // Fetch users

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (role !== "all") {
        params.role = role;
      }

      const res = await api.get("/admin/users", {
        params,
      });

      const data = res.data.data;

      setUsers(Array.isArray(data.users) ? data.users : []);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          totalUsers: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update URL

  useEffect(() => {
  const params = {
    page,
    role,
  };


  if (search.trim()) {
    params.search = search.trim();
  }


  setSearchParams(params, {
    replace: true,
  });


}, [
  page,
  role,
  search,
  setSearchParams,
]);

  const handleSearch = () => {

  const value = searchText.trim();

  console.log("Searching:", value);

  setPage(1);

  setSearch(value);

};

  const handleFilter = (selectedRole) => {
    setRole(selectedRole);

    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>

        <p className="mt-2 text-gray-400">
          Search users, update roles and manage accounts.
        </p>
      </div>

      {/* Search Section */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <InputField
            label="Search"
            name="search"
            placeholder="Search by name or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            icon={Search}
          />
        </div>

        <div className="w-full md:w-40">
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Role Filters */}

      <div className="flex flex-wrap gap-3">
        {[
          {
            label: "All",
            value: "all",
          },
          {
            label: "Students",
            value: "student",
          },
          {
            label: "Organizers",
            value: "organizer",
          },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value)}
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-semibold
              transition

              ${
                role === item.value
                  ? "bg-blue-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }

            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Count */}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Total Users ({pagination.totalUsers})
        </h2>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="
                  animate-pulse
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                "
            >
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div
                    className="
                        h-5
                        w-40
                        rounded
                        bg-white/10
                      "
                  />

                  <div
                    className="
                        h-4
                        w-56
                        rounded
                        bg-white/10
                      "
                  />
                </div>

                <div className="flex gap-3">
                  <div
                    className="
                        h-7
                        w-20
                        rounded-full
                        bg-white/10
                      "
                  />

                  <div
                    className="
                        h-7
                        w-20
                        rounded-full
                        bg-white/10
                      "
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            py-20
            text-center
          "
        >
          <h3 className="text-xl font-semibold text-white">No users found</h3>

          <p className="mt-2 text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-white/5
          "
        >
          {users.map((user, index) => (
            <button
              key={user._id}
              onClick={() => navigate(`/admin/users/${user._id}`)}
              className={`
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  p-5
                  text-left
                  transition
                  hover:bg-white/10

                  ${
                    index !== users.length - 1 ? "border-b border-white/10" : ""
                  }

                `}
            >
              {/* User Info */}

              <div className="min-w-0 flex-1">
                <h3
                  className="
                      truncate
                      text-lg
                      font-semibold
                      text-white
                    "
                >
                  {user.fullName}
                </h3>

                <p
                  className="
                      mt-1
                      truncate
                      text-sm
                      text-gray-400
                    "
                >
                  {user.email}
                </p>

                <p
                  className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                >
                  {user.mobile}
                </p>
              </div>
              {/* Right Side */}

              <div className="flex items-center gap-3">
                {/* Role */}

                <span
                  className={`
                      hidden
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      capitalize
                      sm:block

                      ${
                        user.role === "organizer"
                          ? "bg-orange-500/20 text-orange-400"
                          : user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                      }

                    `}
                >
                  {user.role}
                </span>

                {/* Status */}

                <span
                  className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold

                      ${
                        user.status === "blocked"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }

                    `}
                >
                  {user.status === "blocked" ? "Blocked" : "Active"}
                </span>

                {/* Arrow */}

                <span
                  className="
                      text-2xl
                      text-gray-500
                      transition
                      group-hover:translate-x-1
                      group-hover:text-white
                    "
                >
                  ›
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}

      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      )}
    </div>
  );
};

export default ManageUsers;
