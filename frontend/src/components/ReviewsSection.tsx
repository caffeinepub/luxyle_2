import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetApprovedFeedback } from '../hooks/useQueries';
import type { Feedback } from '../backend';

const SEED_REVIEWS = [
  {
    name: 'Priya S.',
    rating: 5,
    review: 'Luxyle completely transformed my living space. The décor is elegant and premium.',
  },
  {
    name: 'Rahul M.',
    rating: 5,
    review: 'Exceptional quality and beautiful collection. Highly recommended!',
  },
  {
    name: 'Neha K.',
    rating: 5,
    review: 'Perfect place for luxury home décor in Indore.',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-gold fill-gold' : 'text-beige-dark'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ name, rating, review }: { name: string; rating: number; review: string }) {
  return (
    <div className="bg-ivory p-8 shadow-luxury border-t-2 border-gold flex flex-col gap-4">
      <StarRating rating={rating} />
      <p className="font-heading text-charcoal/80 text-lg font-light italic leading-relaxed">
        "{review}"
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="h-px flex-1 bg-beige-dark" />
        <span className="font-body text-sm text-royal-blue font-medium tracking-wide">
          — {name}
        </span>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { data: approvedFeedback, isLoading } = useGetApprovedFeedback();

  const dynamicReviews: Array<{ name: string; rating: number; review: string }> =
    (approvedFeedback ?? []).map((fb: Feedback) => ({
      name: fb.name,
      rating: Number(fb.rating),
      review: fb.review,
    }));

  const allReviews = [...SEED_REVIEWS, ...dynamicReviews];

  return (
    <section id="reviews" className="py-24 bg-beige px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-4">
            What Our Clients Say
          </h2>
          <div className="gold-divider" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
          {isLoading &&
            Array.from({ length: 1 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-ivory p-8 shadow-luxury border-t-2 border-beige-dark">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
