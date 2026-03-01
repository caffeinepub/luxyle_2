import AboutSection from '../components/AboutSection';
import CollectionGallery from '../components/CollectionGallery';
import ReviewsSection from '../components/ReviewsSection';
import FeedbackForm from '../components/FeedbackForm';
import AppointmentBooking from '../components/AppointmentBooking';
import { Navigation, CalendarDays } from 'lucide-react';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';

function HeroSection() {
  const scrollToAppointments = () => {
    document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1920x1080.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 space-y-8 max-w-4xl mx-auto">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="text-gold/80 font-serif text-lg">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
        </div>

        <div className="space-y-4">
          <p className="font-sans-luxe text-xs tracking-[0.35em] uppercase text-gold/90 font-semibold">
            Luxury Interior Décor
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-semibold text-cream tracking-widest">
            LUXYLE
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          <p className="font-serif text-xl md:text-2xl text-cream/80 font-medium italic tracking-wide">
            Elevating Spaces with Timeless Luxury
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={scrollToAppointments}
            className="group flex items-center gap-2 bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 transition-all duration-300 shadow-luxury hover:shadow-luxury-lg"
          >
            <CalendarDays size={14} />
            Book Appointment
          </button>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-cream/50 hover:border-gold text-cream hover:text-gold font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 transition-all duration-300 backdrop-blur-sm"
          >
            <Navigation size={14} />
            Get Directions
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
          <span className="font-sans-luxe text-xs tracking-widest text-cream/40 uppercase font-medium">Scroll</span>
        </div>
      </div>
    </section>
  );
}

function FeaturedPreview() {
  const PREVIEW_IMAGES = [
    'https://img.sanishtech.com/u/f56125b1f2f52137b6f021abfd8fe562.jpeg',
    'https://img.sanishtech.com/u/d63b3f1566e29fe235b38438a157903f.jpeg',
    'https://img.sanishtech.com/u/d4418e844613722b5c6a9ca37c49d9c4.jpeg',
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-luxe">
        <div className="text-center space-y-3 mb-10">
          <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
            Featured Pieces
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-royal-blue">
            Discover Our World
          </h2>
          <div className="gold-divider w-20 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PREVIEW_IMAGES.map((src, i) => (
            <div key={i} className="group relative overflow-hidden aspect-[4/3] bg-beige">
              <img
                src={src}
                alt={`Featured piece ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/40 hover:border-gold-dark pb-0.5"
          >
            View Full Collection →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPreview />
      <AboutSection />
      <CollectionGallery />
      <ReviewsSection />
      <FeedbackForm />
      <AppointmentBooking />
    </>
  );
}
