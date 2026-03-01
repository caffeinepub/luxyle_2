import { MapPin, CalendarDays } from 'lucide-react';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';

export default function HeroSection() {
  const scrollToAppointment = () => {
    document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/luxyle-hero-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-royal-blue/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gold" />
          <span className="font-body text-gold text-xs tracking-[0.3em] uppercase">
            Luxury Interior Décor
          </span>
          <div className="h-px w-16 bg-gold" />
        </div>

        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-ivory tracking-widest mb-4">
          LUXYLE
        </h1>

        <div className="gold-divider mb-6" />

        <p className="font-heading text-xl md:text-2xl lg:text-3xl text-ivory/90 font-light italic tracking-wide mb-12">
          Elevating Spaces with Timeless Luxury
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToAppointment}
            className="flex items-center gap-2 px-8 py-4 bg-gold text-royal-blue font-body text-sm tracking-widest uppercase hover:bg-gold-dark transition-all duration-300 shadow-gold min-w-[200px] justify-center"
          >
            <CalendarDays size={16} />
            Book Appointment
          </button>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 border border-ivory text-ivory font-body text-sm tracking-widest uppercase hover:bg-ivory hover:text-royal-blue transition-all duration-300 min-w-[200px] justify-center"
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gold/60" />
        <span className="font-body text-gold/60 text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}
