import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { SiInstagram } from 'react-icons/si';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Appointments', href: '/#appointments' },
  { label: 'Contact', href: '/contact' },
];

const INSTAGRAM_URL = 'https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-luxury border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-luxe flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://img.sanishtech.com/u/8c046117c1f457369a95832e192ddad3.jpeg"
            alt="Luxyle logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('/#') ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-sans-luxe text-xs tracking-[0.18em] uppercase font-semibold text-foreground/70 hover:text-gold-dark transition-colors duration-200"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="font-sans-luxe text-xs tracking-[0.18em] uppercase font-semibold text-foreground/70 hover:text-gold-dark transition-colors duration-200"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right: Instagram + Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-foreground/60 hover:text-gold-dark transition-colors duration-200"
          >
            <SiInstagram size={18} />
          </a>

          <button
            className="lg:hidden text-foreground/70 hover:text-gold-dark transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-cream/98 backdrop-blur-md border-t border-gold/20 shadow-luxury-lg">
          <nav className="container-luxe py-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="font-sans-luxe text-xs tracking-[0.18em] uppercase font-semibold text-foreground/70 hover:text-gold-dark transition-colors text-left"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans-luxe text-xs tracking-[0.18em] uppercase font-semibold text-foreground/70 hover:text-gold-dark transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
