import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Grid, List, Calendar } from "lucide-react";
import api from "../../api/axios";

import EventCard from "../../components/EventCard";
import PageHeader from "../../components/PageHeader";
import SearchFilterBar from "../../components/SearchFilterBar";
import EmptyState from "../../components/EmptyState";

const BrowseEvents = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events?status=published");
      console.log(res.data);
      setEvents(res.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? evt.category?._id === selectedCategory || evt.category?.name === selectedCategory
      : true;

    let matchesPrice = true;
    if (selectedPriceFilter === "free") {
      matchesPrice = Number(evt.price || 0) === 0;
    } else if (selectedPriceFilter === "paid") {
      matchesPrice = Number(evt.price || 0) > 0;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="DISCOVER & EXPLORE"
        title="Browse Campus Events"
        subtitle="Filter through coding hackathons, cultural nights, sports tournaments, and workshops across your university."
        action={
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12121A] p-1.5 backdrop-blur-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl p-2.5 transition ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-xl p-2.5 transition ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              <List size={18} />
            </button>
          </div>
        }
      />

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Filter by event title, speaker, or venue..."
        extraActions={
          <select
            value={selectedPriceFilter}
            onChange={(e) => setSelectedPriceFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm font-medium text-gray-200 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="free">Free Events</option>
            <option value="paid">Paid Passes</option>
          </select>
        }
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Matching Events"
          description="We couldn't find any events matching your selected filters. Try searching for a different keyword or resetting your search."
          action={
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedPriceFilter("all");
              }}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Reset All Filters
            </button>
          }
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt._id || evt.id}
              event={evt}
              onView={() => navigate(`/event/${evt._id || evt.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
