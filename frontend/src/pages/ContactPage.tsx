import { SiInstagram } from 'react-icons/si';
import { MapPin, Clock, Navigation, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const INSTAGRAM_URL = 'https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.8!2d75.8!3d22.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd0b0b0b0b0b%3A0x0!2sAditya+Cosmopolitan%2C+Nemawar+Rd%2C+Indore!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', hours: '10:00 AM – 7:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 8:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSent(true);
    toast.success('Message sent! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-foreground py-20 text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="text-gold/80 font-serif text-lg">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
        </div>
        <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold/80 font-semibold">
          Get in Touch
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-cream">Contact Us</h1>
        <div className="gold-divider w-24 mx-auto" />
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div className="space-y-10">
              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold-dark font-bold">
                  Our Location
                </h3>
                <div className="gold-divider w-8" />
                <div className="flex gap-3">
                  <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                  <address className="not-italic font-sans-luxe text-sm leading-relaxed text-foreground/70 font-medium">
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

              {/* Hours */}
              <div className="space-y-4">
                <h3 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold-dark font-bold">
                  Business Hours
                </h3>
                <div className="gold-divider w-8" />
                <div className="space-y-2">
                  {BUSINESS_HOURS.map(({ day, hours }) => (
                    <div key={day} className="flex items-center gap-3">
                      <Clock size={12} className="text-gold shrink-0" />
                      <span className="font-sans-luxe text-xs text-foreground/60 font-medium">
                        <span className="font-semibold text-foreground/80">{day}:</span> {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold-dark font-bold">
                  Connect With Us
                </h3>
                <div className="gold-divider w-8" />
                <div className="space-y-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground/60 hover:text-gold transition-colors group"
                  >
                    <SiInstagram size={16} className="text-gold" />
                    <span className="font-sans-luxe text-sm font-medium">@luxyleofficial</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-sans-luxe text-xs tracking-[0.2em] uppercase text-gold-dark font-bold">
                  Send a Message
                </h3>
                <div className="gold-divider w-8" />
              </div>

              {sent ? (
                <div className="text-center py-12 space-y-4 bg-cream border border-gold/20 p-8">
                  <Mail size={40} className="text-gold mx-auto" />
                  <h4 className="font-serif text-2xl font-semibold text-royal-blue">Message Sent!</h4>
                  <p className="font-sans-luxe text-sm text-foreground/60 font-medium">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/40 hover:border-gold-dark pb-0.5"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Mail size={14} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 bg-beige">
        <iframe
          src={MAP_EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Luxyle Store Location"
        />
      </section>
    </div>
  );
}
