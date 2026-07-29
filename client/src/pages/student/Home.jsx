import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, Sparkles, ArrowRight, Ticket, Heart, Flame } from "lucide-react";
import api from "../../api/axios";

import EventCard from "../../components/EventCard";
import StatCard from "../../components/StatCard";
import SearchFilterBar from "../../components/SearchFilterBar";
import EmptyState from "../../components/EmptyState";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [userStats, setUserStats] = useState({
    myBookingsCount: 0,
    favoritesCount: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [eventsRes, categoriesRes, bookingsRes, favoritesRes] = await Promise.allSettled([
        api.get("/events?status=published"),
        api.get("/categories"),
        api.get("/bookings/my-bookings"),
        api.get("/favorites"),
      ]);

      if (eventsRes.status === "fulfilled") {
        setEvents(eventsRes.value.data.data || []);
      }
      if (categoriesRes.status === "fulfilled") {
        setCategories(categoriesRes.value.data.data || []);
      }
      if (bookingsRes.status === "fulfilled") {
        const bookingsList = bookingsRes.value.data.data || [];
        setUserStats((prev) => ({ ...prev, myBookingsCount: bookingsList.length }));
      }
      if (favoritesRes.status === "fulfilled") {
        const favsList = favoritesRes.value.data.data || [];
        setUserStats((prev) => ({ ...prev, favoritesCount: favsList.length }));
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
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

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-[#12121A] p-8 backdrop-blur-2xl md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <Sparkles size={14} />
            <span>CAMPUS EVENT FEED</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Welcome, {user?.fullName || "Student"}! 🎓
          </h1>

          <p className="text-sm leading-relaxed text-gray-300">
            Discover upcoming hackathons, cultural festivals, tech workshops, and sports matches around your campus. Grab your E-Ticket passes now!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <span>Explore All Events</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <Ticket size={16} />
              View My Passes
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Published Events"
          value={events.length}
          icon={Flame}
          color="from-blue-500 to-cyan-500"
          subtitle="Active campus events available for registration"
          loading={loading}
        />

        <StatCard
          title="My Booked Passes"
          value={userStats.myBookingsCount}
          icon={Ticket}
          color="from-purple-500 to-indigo-500"
          subtitle="Your reserved event tickets"
          loading={loading}
        />

        <StatCard
          title="Saved Favorites"
          value={userStats.favoritesCount}
          icon={Heart}
          color="from-rose-500 to-pink-500"
          subtitle="Events bookmarked on your wishlist"
          loading={loading}
        />
      </div>

      {/* Search & Category Filter Section */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Search upcoming campus events..."
      />

      {/* Upcoming Events Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Featured Campus Events</h2>
            <p className="text-xs text-gray-400">Handpicked upcoming events for you</p>
          </div>

          <button
            onClick={() => navigate("/browse")}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
          >
            <span>See All ({events.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            description="We couldn't find any campus events matching your criteria. Try adjusting your search filters!"
            action={
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default Home;
