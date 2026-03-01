import { Star } from 'lucide-react';
import { useGetApprovedFeedback } from '../hooks/useQueries';
import type { Feedback } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

const SEEDED_REVIEWS = [
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
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-gold fill-gold' : 'text-gold/30'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ name, rating, review }: { name: string; rating: number; review: string }) {
  return (
    <div className="bg-cream border border-gold/20 p-8 space-y-4 hover:border-gold/50 hover:shadow-luxury transition-all duration-300 group">
      <div className="text-gold/40 font-serif text-5xl leading-none select-none group-hover:text-gold/60 transition-colors">"</div>
      <p className="font-sans-luxe text-sm leading-relaxed text-foreground/70 font-medium italic">
        {review}
      </p>
      <div className="pt-2 border-t border-gold/15 flex items-center justify-between">
        <span className="font-serif text-base text-royal-blue font-semibold">— {name}</span>
        <StarRating rating={rating} />
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { data: approvedFeedback, isLoading } = useGetApprovedFeedback();

  return (
    <section id="reviews" className="section-padding bg-beige">
      <div className="container-luxe">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="flex items-center justify-center gap-4">
            <div className="gold-divider w-16" />
            <span className="text-gold text-xl font-serif">✦</span>
            <div className="gold-divider w-16" />
          </div>
          <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
            Client Experiences
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-royal-blue">
            What Our Clients Say
          </h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>

        {/* Seeded Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {SEEDED_REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>

        {/* Backend Approved Reviews */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 bg-gold/10" />
            ))}
          </div>
        )}

        {!isLoading && approvedFeedback && approvedFeedback.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedFeedback.map((fb: Feedback) => (
              <ReviewCard
                key={fb.id.toString()}
                name={fb.name}
                rating={Number(fb.rating)}
                review={fb.review}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
