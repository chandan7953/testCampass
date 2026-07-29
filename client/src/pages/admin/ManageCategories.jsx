import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Tag, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatters";

const ManageCategories = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCategories: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";

    setPage(urlPage);
    setSearch(urlSearch);
    setSearchText(urlSearch);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/categories", { params });
      const data = res.data.data;

      setCategories(Array.isArray(data.categories) ? data.categories : Array.isArray(data) ? data : []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          totalCategories: data.length || 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params = { page };
    if (search.trim()) params.search = search.trim();
    setSearchParams(params, { replace: true });
  }, [page, search, setSearchParams]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchText.trim());
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      setDeleting(true);
      await api.delete(`/categories/${deleteCategory._id}`);
      toast.success("Category deleted!");
      setDeleteCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="SYSTEM CATEGORIES"
        title="Event Categories"
        subtitle="Manage category tags used by organizers to classify campus events."
        action={
          <button
            onClick={() => navigate("/admin/categories/add")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        }
      />

      {/* Search Input */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/80 p-4 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search category name..."
            className="w-full rounded-2xl border border-white/10 bg-[#181824] py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-2xl bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-lg"
        >
          Search
        </button>
      </div>

      {/* Categories Grid / List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="Create your first event category to help organizers tag their fests."
          icon={Tag}
          action={
            <button
              onClick={() => navigate("/admin/categories/add")}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Add Category
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group flex items-center justify-between rounded-3xl border border-white/10 bg-[#12121A]/90 p-5 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-blue-500/10 text-blue-400 font-bold">
                  {cat.icon?.url ? (
                    <img src={cat.icon.url} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <Tag size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono">Created {formatDate(cat.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => setDeleteCategory(cat)}
                  className="rounded-xl p-2 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deleteCategory)}
        onClose={() => setDeleteCategory(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Are you sure you want to delete <strong className="text-white">{deleteCategory?.name}</strong>?
          </p>
          <p className="text-xs text-rose-400">Events using this category tag may require updating.</p>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setDeleteCategory(null)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Category"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCategories;