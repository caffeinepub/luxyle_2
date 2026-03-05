import { useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SiInstagram } from "react-icons/si";

const INSTAGRAM_URL =
  "https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==";
const LOGO_URL =
  "https://img.sanishtech.com/u/95787e829fcef28318a59bddd97c1542.jpeg";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = () => {
    setMobileOpen(false);
    navigate({ to: "/" });
  };

  const goContact = () => {
    setMobileOpen(false);
    navigate({ to: "/contact" });
  };

  const navLinks = [
    { label: "Home", action: goHome },
    { label: "Collection", action: () => scrollTo("collection") },
    { label: "About", action: () => scrollTo("about") },
    { label: "Contact", action: goContact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-ivory/95 backdrop-blur-md shadow-luxury border-b border-beige-dark"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-3 group"
        >
          <img
            src={LOGO_URL}
            alt="Luxyle"
            className="h-12 w-auto object-contain rounded"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={link.action}
              className={`font-body text-sm tracking-widest uppercase transition-colors hover:text-gold ${
                isScrolled ? "text-royal-blue" : "text-ivory/90"
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-gold ${
              isScrolled ? "text-royal-blue" : "text-ivory/90"
            }`}
            aria-label="Instagram"
          >
            <SiInstagram size={18} />
          </a>
          <button
            type="button"
            onClick={() => scrollTo("appointment")}
            className="font-body text-sm tracking-widest uppercase px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-ivory transition-all duration-300"
          >
            Book Appointment
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-gold ${
              isScrolled ? "text-royal-blue" : "text-ivory"
            }`}
            aria-label="Instagram"
          >
            <SiInstagram size={18} />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`transition-colors ${isScrolled ? "text-royal-blue" : "text-ivory"}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-beige-dark shadow-luxury-lg">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={link.action}
                className="font-body text-sm tracking-widest uppercase text-royal-blue hover:text-gold transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("appointment")}
              className="font-body text-sm tracking-widest uppercase px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-ivory transition-all duration-300 text-center mt-2"
            >
              Book Appointment
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
