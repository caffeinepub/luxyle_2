import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import AppointmentBooking from '../components/AppointmentBooking';

const INSTAGRAM_URL = 'https://www.instagram.com/luxyleofficial?igsh=MTA3aTJqNzJtY2Z2ZQ==';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';
const MAPS_EMBED =
  'https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Aditya+Cosmopolitan,+Nemawar+Rd,+near+Lakhani+Factory,+Indore,+Madhya+Pradesh+452001';

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: 'Our Location',
    content: 'Aditya Cosmopolitan, Nemawar Rd,\nnear Lakhani Factory,\nIndore, Madhya Pradesh 452001',
    action: { label: 'Get Directions', href: MAPS_URL },
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: 'Monday – Saturday\n10:00 AM – 7:00 PM\n\nSunday: Closed',
    action: null,
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'sharanya.242628@gmail.com',
    action: { label: 'Send Email', href: 'mailto:sharanya.242628@gmail.com' },
  },
  {
    icon: Phone,
    title: 'Follow Us',
    content: '@luxyleofficial',
    action: { label: 'Instagram', href: INSTAGRAM_URL },
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="pt-32 pb-20 bg-royal-blue text-center px-6">
        <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-4">
          We'd Love to Hear From You
        </p>
        <h1 className="font-heading text-5xl md:text-6xl text-ivory font-light tracking-wide mb-4">
          Contact Us
        </h1>
        <div className="gold-divider" />
        <p className="font-body text-ivory/70 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
          Visit our showroom or reach out to us. Our team is here to help you create the perfect
          luxurious space.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-ivory px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-beige p-8 border-t-2 border-gold shadow-luxury flex flex-col gap-4"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-gold">
                  <Icon size={18} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl text-royal-blue font-medium">{card.title}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed whitespace-pre-line flex-1">
                  {card.content}
                </p>
                {card.action && (
                  <a
                    href={card.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs tracking-widest uppercase text-gold border-b border-gold pb-1 hover:text-gold-dark transition-colors self-start"
                  >
                    {card.action.label} →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Map + Contact Form */}
      <section className="py-20 bg-beige px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div>
            <h2 className="font-heading text-3xl text-royal-blue font-light mb-6">Find Us</h2>
            <div className="gold-divider-left mb-8" />
            <div className="w-full h-80 bg-beige-dark overflow-hidden shadow-luxury">
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Luxyle Store Location"
              />
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 border border-gold text-gold font-body text-sm tracking-widest uppercase hover:bg-gold hover:text-royal-blue transition-all duration-300"
            >
              <MapPin size={14} />
              Get Directions
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-3xl text-royal-blue font-light mb-6">Send a Message</h2>
            <div className="gold-divider-left mb-8" />
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-royal-blue text-center px-6">
        <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-4">
          Stay Inspired
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-ivory font-light mb-6">
          Follow Us on Instagram
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold font-body text-sm tracking-widest uppercase hover:bg-gold hover:text-royal-blue transition-all duration-300"
        >
          <SiInstagram size={18} />
          @luxyleofficial
        </a>
      </section>

      {/* Appointment Booking */}
      <AppointmentBooking />
    </>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with form data
    const subject = encodeURIComponent(`Contact from ${formData.name} - Luxyle`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.open(`mailto:sharanya.242628@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="font-heading text-2xl text-royal-blue font-light mb-4">Message Sent!</p>
        <p className="font-body text-charcoal/70 text-sm">
          Thank you for reaching out. We'll get back to you soon.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
          className="mt-6 font-body text-sm tracking-widest uppercase text-royal-blue border-b border-gold pb-1 hover:text-gold transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
          className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
          required
        />
      </div>
      <div>
        <label className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
          required
        />
      </div>
      <div>
        <label className="font-body text-xs tracking-widest uppercase text-charcoal/60 block mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help you?"
          rows={5}
          className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors resize-none"
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 px-8 py-4 bg-royal-blue text-ivory font-body text-sm tracking-widest uppercase hover:bg-royal-blue-light transition-all duration-300"
      >
        <Mail size={16} />
        Send Message
      </button>
    </form>
  );
}

// Need useState import
import { useState } from 'react';
