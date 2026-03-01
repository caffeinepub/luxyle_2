import React from 'react';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetApprovedFeedback } from '../hooks/useQueries';

interface ReviewCard {
  name: string;
  rating: number;
  review: string;
  source?: 'backend' | 'seed';
}

const SEED_REVIEWS: ReviewCard[] = [
  {
    name: 'Priya Sharma',
    rating: 5,
    review:
      'Absolutely stunning collection! The quality of the fabrics is exceptional and the staff was incredibly helpful in finding the perfect outfit for my wedding.',
    source: 'seed',
  },
  {
    name: 'Ananya Mehta',
    rating: 5,
    review:
      'Luxyle has completely transformed my wardrobe. Every piece I have purchased has received so many compliments. Truly a luxury experience.',
    source: 'seed',
  },
  {
    name: 'Kavya Patel',
    rating: 4,
    review:
      'Beautiful boutique with an exquisite range of designer wear. The personal styling service is worth every penny. Will definitely return!',
    source: 'seed',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-gold text-gold' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  );
}

function ReviewCardComponent({ review }: { review: ReviewCard }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-luxury transition-shadow duration-300">
      <StarRating rating={review.rating} />
      <p className="text-foreground/80 font-sans text-sm leading-relaxed font-medium italic">
        &ldquo;{review.review}&rdquo;
      </p>
      <div className="mt-auto pt-2 border-t border-border/50">
        <p className="font-semibold text-foreground font-sans text-sm">{review.name}</p>
        <p className="text-xs text-muted-foreground font-sans mt-0.5">Verified Customer</p>
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-full" />
      <div className="mt-auto pt-2 border-t border-border/50 space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { data: approvedFeedback, isLoading } = useGetApprovedFeedback();

  // Map backend feedback to ReviewCard format
  const backendReviews: ReviewCard[] = (approvedFeedback ?? []).map((f) => ({
    name: f.name,
    rating: Number(f.rating),
    review: f.review,
    source: 'backend',
  }));

  // Combine: backend approved reviews first, then seed reviews
  const allReviews = [...backendReviews, ...SEED_REVIEWS];

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 bg-ivory/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-gold font-sans text-xs tracking-[0.25em] uppercase font-semibold mb-3">
            Client Stories
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground font-semibold">
            What Our Clients Say
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-5" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)
            : allReviews.map((review, index) => (
                <ReviewCardComponent key={`${review.source}-${review.name}-${index}`} review={review} />
              ))}
        </div>

        {/* Summary */}
        {!isLoading && backendReviews.length > 0 && (
          <p className="text-center text-xs text-muted-foreground font-sans mt-8">
            Showing {backendReviews.length} verified review{backendReviews.length !== 1 ? 's' : ''} from our customers
          </p>
        )}
      </div>
    </section>
  );
}
