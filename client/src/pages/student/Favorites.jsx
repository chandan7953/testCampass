import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import EventCard from "../../components/EventCard";
import EmptyState from "../../components/EmptyState";

const Favorites = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/favorites");
      setFavorites(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load saved favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await api.delete(`/users/favorites/${eventId}`);
      setFavorites(
        favorites.filter((fav) => {
          const event = fav.event || fav;
          return (event._id || event.id) !== eventId;
        })
      );
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="SAVED BOOKMARKS"
        title="My Favorite Events"
        subtitle="Keep track of upcoming campus events you want to attend."
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-80 w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No Favorites Saved Yet"
          description="Click the heart icon on any campus event card to save it to your personal wishlist."
          icon={Heart}
          action={
            <button
              onClick={() => navigate("/browse")}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
            >
              Browse Campus Events
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => {
            const event = fav.event || fav;
            if (!event || !event.title) return null;
            return (
              <EventCard
                key={fav._id || event._id}
                event={event}
                onView={() => navigate(`/event/${event._id || event.id}`)}
                onRemoveFavorite={() => removeFavorite(event._id || event.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
