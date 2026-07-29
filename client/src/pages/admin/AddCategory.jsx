import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/categories/${id}`);
      const category = res.data.data;
      setName(category.name || "");
      setPreview(category.icon?.url || "");
    } catch (error) {
      toast.error("Failed to fetch category");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIcon(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      if (icon) formData.append("icon", icon);

      if (isEdit) {
        await api.put(`/categories/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated!");
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created!");
      }

      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Category...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <PageHeader
        breadcrumb="CATEGORY BUILDER"
        title={isEdit ? "Edit Category" : "Add Event Category"}
        subtitle={isEdit ? "Update category label and icon graphic." : "Create a new tag for classifying campus events."}
      />

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl md:p-8">
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">Category Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hackathon, Cultural, Sports..."
            className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">Category Graphic Icon</label>
          <input id="catIcon" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

          <label
            htmlFor="catIcon"
            className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-[#181824] p-6 transition hover:border-blue-500/50"
          >
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="preview" className="h-28 w-28 rounded-2xl object-cover border border-white/10 shadow-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIcon(null);
                    setPreview("");
                  }}
                  className="mt-3 flex items-center gap-1 mx-auto text-xs text-rose-400 hover:underline"
                >
                  <Trash2 size={14} /> Remove Icon
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ImageIcon size={28} />
                </div>
                <p className="text-sm font-bold text-white">Upload Icon Image</p>
                <p className="text-xs text-gray-400">PNG, SVG or WEBP</p>
              </div>
            )}
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-gray-300 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : isEdit ? "Update Category" : "Save Category"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;