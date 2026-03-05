import { CheckCircle, Loader2, Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitFeedback } from "../hooks/useQueries";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim() || rating === 0) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }
    submitFeedback(
      { name: name.trim(), rating: BigInt(rating), review: review.trim() },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast.error("Failed to submit feedback. Please try again.");
        },
      },
    );
  };

  if (submitted) {
    return (
      <section className="py-24 bg-ivory px-6">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle size={48} className="text-gold mx-auto mb-6" />
          <h3 className="font-heading text-3xl text-royal-blue font-light mb-4">
            Thank You for Your Feedback
          </h3>
          <div className="gold-divider mb-6" />
          <p className="font-body text-charcoal/70 leading-relaxed">
            Your review has been submitted and is pending approval. We
            appreciate you sharing your experience with Luxyle.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setRating(0);
              setReview("");
            }}
            className="mt-8 font-body text-sm tracking-widest uppercase text-royal-blue border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Submit Another Review
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-ivory px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Share Your Experience
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-4">
            Leave a Review
          </h2>
          <div className="gold-divider" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="feedback-name"
              className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-2"
            >
              Your Name
            </label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>

          {/* Star Rating */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-3">
              Your Rating
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={28}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-gold fill-gold"
                        : "text-beige-dark"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <label
              htmlFor="feedback-review"
              className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-2"
            >
              Your Review
            </label>
            <textarea
              id="feedback-review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with Luxyle..."
              rows={4}
              className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-4 bg-royal-blue text-ivory font-body text-sm tracking-widest uppercase hover:bg-royal-blue-light transition-all duration-300 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
