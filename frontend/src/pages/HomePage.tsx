import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import CollectionGallery from '../components/CollectionGallery';
import AboutSection from '../components/AboutSection';
import ReviewsSection from '../components/ReviewsSection';
import FeedbackForm from '../components/FeedbackForm';
import AppointmentBooking from '../components/AppointmentBooking';

// Stats bar data
const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '1000+', label: 'Curated Pieces' },
  { value: '10+', label: 'Years of Excellence' },
  { value: '100%', label: 'Premium Quality' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Stats Bar */}
      <div className="bg-royal-blue py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl text-gold font-light tracking-wide">{stat.value}</p>
              <p className="font-body text-xs text-ivory/60 tracking-widest uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Collections Preview */}
      <FeaturedCollections />

      {/* About Section */}
      <AboutSection />

      {/* Full Collection Gallery */}
      <CollectionGallery />

      {/* Reviews */}
      <ReviewsSection />

      {/* Feedback Form */}
      <FeedbackForm />

      {/* Appointment Booking */}
      <AppointmentBooking />
    </>
  );
}
