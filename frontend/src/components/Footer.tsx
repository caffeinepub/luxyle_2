import { Link, useNavigate } from '@tanstack/react-router';
import { SiInstagram } from 'react-icons/si';
import { MapPin, Navigation, Heart } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Appointments', href: '/#appointments' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (window.location.pathname !== '/') {
        navigate({ to: '/' }).then(() => {
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const appId = encodeURIComponent(window.location.hostname || 'luxyle');

  return (
    <footer className="bg-foreground text-cream">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-semibold tracking-widest text-gold">LUXYLE</h3>
            <p className="font-sans-luxe text-xs tracking-widest uppercase text-cream/50 font-medium">
              Elevating Spaces with Timeless Luxury
            </p>
            <div className="gold-divider w-16 mt-4" />
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors duration-200 mt-2"
              aria-label="Instagram"
            >
              <SiInstagram size={18} />
              <span className="font-sans-luxe text-xs tracking-widest font-medium">@luxyleofficial</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold/80 font-bold">
              Quick Links
            </h4>
            <div className="gold-divider w-8" />
            <nav className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) =>
                link.href.startsWith('/#') ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="font-sans-luxe text-xs tracking-widest font-medium text-cream/60 hover:text-gold transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="font-sans-luxe text-xs tracking-widest font-medium text-cream/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Address & Directions */}
          <div className="space-y-4">
            <h4 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold/80 font-bold">
              Visit Us
            </h4>
            <div className="gold-divider w-8" />
            <div className="flex gap-3">
              <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
              <address className="not-italic font-sans-luxe text-xs leading-relaxed text-cream/60 font-medium">
                Aditya Cosmopolitan,<br />
                Nemawar Rd, near Lakhani Factory,<br />
                Indore, Madhya Pradesh 452001
              </address>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold hover:bg-gold/10 transition-all duration-200 px-4 py-2 text-xs tracking-widest font-sans-luxe uppercase font-semibold"
            >
              <Navigation size={12} />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container-luxe py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans-luxe text-xs text-cream/40 tracking-widest font-medium">
            © {new Date().getFullYear()} Luxyle. All Rights Reserved.
          </p>
          <p className="font-sans-luxe text-xs text-cream/30 flex items-center gap-1 font-medium">
            Built with <Heart size={11} className="text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
