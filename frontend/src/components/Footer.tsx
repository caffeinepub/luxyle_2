import { useNavigate } from '@tanstack/react-router';
import { MapPin, Phone, Clock, Heart } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';

const INSTAGRAM_URL = 'https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'luxyle');

  const scrollTo = (id: string) => {
    navigate({ to: '/' }).then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  };

  return (
    <footer className="bg-royal-blue text-ivory">
      {/* Gold top border */}
      <div className="h-px bg-gold w-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-3xl font-light tracking-widest text-ivory mb-2">
              LUXYLE
            </h3>
            <div className="gold-divider-left mb-4" />
            <p className="font-body text-sm text-ivory/70 leading-relaxed mb-6">
              Elevating Spaces with Timeless Luxury
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ivory/70 hover:text-gold transition-colors"
              aria-label="Follow us on Instagram"
            >
              <SiInstagram size={20} />
              <span className="font-body text-sm">@luxyleofficial</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg tracking-widest uppercase text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', action: () => navigate({ to: '/' }) },
                { label: 'Collection', action: () => scrollTo('collection') },
                { label: 'About Us', action: () => scrollTo('about') },
                { label: 'Reviews', action: () => scrollTo('reviews') },
                { label: 'Contact', action: () => navigate({ to: '/contact' }) },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="font-body text-sm text-ivory/70 hover:text-gold transition-colors tracking-wide"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg tracking-widest uppercase text-gold mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                'Interior Décor',
                'Space Consultation',
                'Custom Furnishings',
                'Luxury Accessories',
                'Design Planning',
              ].map((service) => (
                <li key={service}>
                  <span className="font-body text-sm text-ivory/70 tracking-wide">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg tracking-widest uppercase text-gold mb-4">
              Visit Us
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <p className="font-body text-sm text-ivory/70 leading-relaxed">
                  Aditya Cosmopolitan, Nemawar Rd,<br />
                  near Lakhani Factory,<br />
                  Indore, Madhya Pradesh 452001
                </p>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="text-gold mt-1 shrink-0" />
                <a
                  href="tel:9669944400"
                  className="font-body text-sm text-ivory/70 hover:text-gold transition-colors"
                >
                  9669944400
                </a>
              </div>
              <div className="flex gap-3">
                <Clock size={16} className="text-gold mt-1 shrink-0" />
                <div className="font-body text-sm text-ivory/70">
                  <p>Mon–Sat: 10:00 AM – 7:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 border border-gold text-gold text-sm font-body tracking-widest uppercase hover:bg-gold hover:text-royal-blue transition-all duration-300"
              >
                <MapPin size={14} />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-ivory/50">
            © {year} Luxyle. All Rights Reserved.
          </p>
          <p className="font-body text-sm text-ivory/40 flex items-center gap-1">
            Built with <Heart size={13} className="text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
