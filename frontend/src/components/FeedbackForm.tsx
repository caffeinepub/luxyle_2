import { useState } from 'react';
import { Star, CheckCircle, Loader2 } from 'lucide-react';
import { useSubmitFeedback } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !review.trim()) {
      toast.error('Please fill in all fields and select a rating.');
      return;
    }
    try {
      await submitMutation.mutateAsync({ name: name.trim(), rating: BigInt(rating), review: review.trim() });
      setSubmitted(true);
      setName('');
      setRating(0);
      setReview('');
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle size={48} className="text-gold mx-auto" />
        <h3 className="font-serif text-2xl font-semibold text-royal-blue">Thank You!</h3>
        <p className="font-sans-luxe text-sm text-foreground/60 font-medium">
          Your feedback has been submitted and is awaiting approval.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/40 hover:border-gold-dark pb-0.5"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxe">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-10">
            <div className="flex items-center justify-center gap-4">
              <div className="gold-divider w-16" />
              <span className="text-gold text-xl font-serif">✦</span>
              <div className="gold-divider w-16" />
            </div>
            <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
              Share Your Experience
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-royal-blue">
              Leave a Review
            </h2>
            <div className="gold-divider w-24 mx-auto" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                required
              />
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                Rating
              </label>
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
                          ? 'text-gold fill-gold'
                          : 'text-gold/30'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="space-y-2">
              <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with Luxyle..."
                rows={4}
                className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
