import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const EventReviews = ({ eventId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/event/${eventId}`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/reviews", {
        eventId,
        rating,
        comment,
      });
      toast.success("Review submitted successfully");
      setRating(5);
      setComment("");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        size={14}
        className={idx < count ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-gray-600"}
      />
    ));
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <MessageSquare size={20} className="text-blue-400" />
        <h3 className="text-xl font-bold text-white">Event Reviews</h3>
        <span className="ml-2 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-gray-300">
          {reviews.length}
        </span>
      </div>

      {user?.role === "student" && (
        <div className="rounded-3xl border border-white/10 bg-[#12121A]/80 p-6 backdrop-blur-xl">
          <h4 className="mb-4 text-sm font-bold text-white">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-400 uppercase">Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRating(idx + 1)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={idx < rating ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-gray-600"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-400 uppercase">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-gray-500">
            No reviews yet. Be the first to review this event!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="rounded-3xl border border-white/10 bg-[#12121A]/60 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.userId?.profileImage ? (
                    <img
                      src={review.userId.profileImage}
                      alt={review.userId.fullName}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 ring-2 ring-white/10">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{review.userId?.fullName || "Anonymous"}</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
              </div>
              {review.comment && <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventReviews;
