import { useCallback, useEffect, useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  Plus,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/axios";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";

const ManageCategories = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [deleteCategory, setDeleteCategory] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      totalCategories: 0,
      totalPages: 1,
    });

  /* -----------------------------
      Load Query Params
  ----------------------------- */

  useEffect(() => {
    const urlPage =
      Number(searchParams.get("page")) || 1;

    const urlSearch =
      searchParams.get("search") || "";

    setPage(urlPage);

    setSearch(urlSearch);

    setSearchText(urlSearch);
  }, []);

  /* -----------------------------
      Fetch Categories
  ----------------------------- */

  const fetchCategories =
    useCallback(async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: 10,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        const res = await api.get(
          "/categories",
          {
            params,
          }
        );

        const data = res.data.data;

        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );

        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            totalCategories: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* -----------------------------
      Update URL
  ----------------------------- */

  useEffect(() => {
    const params = {
      page,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    page,
    search,
    setSearchParams,
  ]);

  /* -----------------------------
      Search
  ----------------------------- */

  const handleSearch = () => {
    setPage(1);

    setSearch(
      searchText.trim()
    );
  };

  /* -----------------------------
      Delete Category
  ----------------------------- */

  const handleDelete =
    async () => {
      if (!deleteCategory) return;

      try {
        setDeleting(true);

        await api.delete(
          `/categories/${deleteCategory._id}`
        );

        toast.success(
          "Category deleted successfully"
        );

        setDeleteCategory(null);

        fetchCategories();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete category"
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Manage Categories
          </h1>

          <p className="mt-2 text-gray-400">
            Create, update and organize
            event categories.
          </p>

        </div>

        <div className="w-full md:w-auto">

          <Button
          className="pr-4 pl-4"
            onClick={() =>
              navigate(
                "/admin/categories/add"
              )
            }
          >
            <Plus
              size={18}
              className="mr-2 "
            />
            Add Category
          </Button>

        </div>

      </div>

      {/* Search */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        <div className="flex-1">

          <InputField
            label="Search"
            name="search"
            placeholder="Search category..."
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                handleSearch();
              }
            }}
            icon={Search}
          />

        </div>

        <div className="w-full md:w-40">

          <Button
            onClick={handleSearch}
          >
            Search
          </Button>

        </div>

      </div>

      {/* Count */}

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-white">

          Total Categories (
          {
            pagination.totalCategories
          }
          )

        </h2>

      </div>
            {/* Category List */}

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-white/10" />

                  <div className="space-y-2">
                    <div className="h-5 w-44 rounded bg-white/10" />
                    <div className="h-4 w-28 rounded bg-white/10" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-20 rounded-xl bg-white/10" />
                  <div className="h-10 w-20 rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <div className="text-5xl">📂</div>

          <h3 className="mt-5 text-xl font-semibold text-white">
            No Categories Found
          </h3>

          <p className="mt-2 text-gray-400">
            Create your first category to organize events.
          </p>

          <div className="mx-auto mt-8 w-full max-w-xs">
            <Button
              onClick={() =>
                navigate("/admin/categories/add")
              }
            >
              <Plus
                size={18}
                className="mr-2"
              />
              Add Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {categories.map(
            (category, index) => (
              <div
                key={category._id}
                className={`flex flex-col gap-5 p-5 transition hover:bg-white/10 md:flex-row md:items-center md:justify-between ${
                  index !==
                  categories.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                {/* Left */}

                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {category.icon ? (
                      <img
                        src={category.icon.url}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">
                        📁
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-white">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Created{" "}
                      {new Date(
                        category.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/categories/edit/${category._id}`
                      )
                    }
                    className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteCategory(category)
                    }
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
            {/* Pagination */}

      {!loading &&
        pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={
              pagination.totalPages
            }
            onPageChange={(
              newPage
            ) => {
              setPage(newPage);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        )}

      {/* Delete Modal */}

      {deleteCategory && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-[#18181b]
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-bold
                text-white
              "
            >
              Delete Category
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-gray-400
              "
            >
              Are you sure you want to
              delete
              <span className="font-semibold text-white">
                {" "}
                {deleteCategory.name}
              </span>
              ?
            </p>

            <p
              className="
                mt-2
                text-sm
                text-red-400
              "
            >
              This action cannot be
              undone.
            </p>

            <div
              className="
                mt-8
                flex
                gap-3
              "
            >
              <Button
                variant="secondary"
                onClick={() =>
                  setDeleteCategory(
                    null
                  )
                }
              >
                Cancel
              </Button>

              <Button
                loading={deleting}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;