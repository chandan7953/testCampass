import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, Calendar, MapPin, Tag, Users, IndianRupee, Save } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEdit = Boolean(eventId);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    price: "0",
    startDate: "",
    endDate: "",
    capacity: "100",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchCategories();
    await fetchVenues();
    if (isEdit) {
      await fetchEvent();
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data?.categories || res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await api.get("/venues");
      setVenues(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvent = async () => {
    try {
      setPageLoading(true);
      const res = await api.get(`/events/${eventId}`);
      const event = res.data.data;

      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.category?._id || event.category || "",
        venue: event.venue?._id || event.venue || "",
        price: event.price !== undefined ? String(event.price) : "0",
        startDate: event.startDate ? event.startDate.slice(0, 16) : "",
        endDate: event.endDate ? event.endDate.slice(0, 16) : "",
        capacity: event.capacity || "100",
      });

      if (event.poster) setPreview(event.poster);
    } catch (error) {
      toast.error("Failed to load event details");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPoster(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate) {
      toast.error("Please fill in event title and start date");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("venue", formData.venue);
      data.append("price", formData.price);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("capacity", formData.capacity);

      if (poster) {
        data.append("poster", poster);
      }

      if (isEdit) {
        await api.put(`/events/${eventId}`, data);
        toast.success("Event updated successfully!");
      } else {
        await api.post("/events", data);
        toast.success("Event created successfully!");
      }

      navigate("/organizer/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-400">Loading Event Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <PageHeader
        breadcrumb="EVENT MANAGEMENT"
        title={isEdit ? "Edit Event" : "Host New Campus Event"}
        subtitle={
          isEdit
            ? "Update event details, ticket price, dates, or capacity."
            : "Fill in the details below to list your fest, hackathon, or workshop."
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl md:p-8">
        {/* Poster Upload Box */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">Event Poster Banner</label>
          <input id="poster" type="file" accept="image/*" onChange={handlePosterChange} className="hidden" />

          <label
            htmlFor="poster"
            className="group relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-[#181824] transition hover:border-blue-500/50"
          >
            {preview ? (
              <img src={preview} alt="Poster preview" className="h-full w-full object-cover transition group-hover:scale-105" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Image size={28} />
                </div>
                <p className="text-sm font-bold text-white">Click to Upload Poster</p>
                <p className="text-xs text-gray-400">PNG, JPG or WEBP up to 5MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Event Title *</label>
          <input
            type="text"
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Annual Hackathon 2026"
            className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Description</label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what students will learn or experience..."
            className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Category & Venue Dropdowns */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Campus Venue</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Select Venue</option>
              {venues.map((vn) => (
                <option key={vn._id || vn.id} value={vn._id || vn.id}>
                  {vn.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time Selectors */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Start Date & Time *</label>
            <input
              type="datetime-local"
              required
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">End Date & Time</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Capacity & Price */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Capacity (Max Seats)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="100"
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-300 uppercase">Ticket Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0 for Free"
              className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-[1.01] disabled:opacity-50"
        >
          <Save size={18} />
          <span>{loading ? "Saving Event..." : isEdit ? "Update Event" : "Create & List Event"}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;