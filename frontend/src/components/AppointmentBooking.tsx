import { useState } from 'react';
import { CalendarDays, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useBookAppointment, useGetBlockedDates } from '../hooks/useQueries';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
];

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export default function AppointmentBooking() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: blockedDates = [] } = useGetBlockedDates();
  const bookMutation = useBookAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !date || !time) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (blockedDates.includes(date)) {
      toast.error('The selected date is not available. Please choose another date.');
      return;
    }
    try {
      await bookMutation.mutateAsync({ name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim(), date, time });
      setSubmitted(true);
    } catch {
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-5">
        <CheckCircle size={56} className="text-gold mx-auto" />
        <h3 className="font-serif text-3xl font-semibold text-royal-blue">Appointment Requested!</h3>
        <p className="font-sans-luxe text-sm text-foreground/60 font-medium max-w-md mx-auto">
          Thank you for reaching out. Our team will review your request and confirm your appointment shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setName(''); setPhone(''); setEmail(''); setMessage(''); setDate(''); setTime(''); }}
          className="font-sans-luxe text-xs tracking-widest uppercase font-semibold text-gold hover:text-gold-dark transition-colors border-b border-gold/40 hover:border-gold-dark pb-0.5"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <section id="appointments" className="section-padding bg-beige">
      <div className="container-luxe">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-4">
              <div className="gold-divider w-16" />
              <span className="text-gold text-xl font-serif">✦</span>
              <div className="gold-divider w-16" />
            </div>
            <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
              Schedule a Visit
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-royal-blue">
              Book an Appointment
            </h2>
            <div className="gold-divider w-24 mx-auto" />
            <p className="font-sans-luxe text-sm text-foreground/60 font-medium">
              Visit our showroom and let our experts guide you through our exclusive collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                  Phone Number <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                  Email Address <span className="text-gold">*</span>
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

              {/* Date */}
              <div className="space-y-2">
                <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium flex items-center gap-2">
                  <CalendarDays size={12} />
                  Preferred Date <span className="text-gold">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  min={getTodayString()}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full bg-cream border focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground transition-colors ${
                    date && blockedDates.includes(date) ? 'border-destructive' : 'border-gold/30'
                  }`}
                  required
                />
                {date && blockedDates.includes(date) && (
                  <p className="text-xs text-destructive font-sans-luxe font-medium">
                    This date is unavailable. Please select another.
                  </p>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium flex items-center gap-2">
                <Clock size={12} />
                Preferred Time <span className="text-gold">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-1 text-xs font-sans-luxe tracking-wide font-medium border transition-all duration-200 ${
                      time === slot
                        ? 'bg-gold border-gold text-foreground font-semibold'
                        : 'bg-cream border-gold/30 text-foreground/60 hover:border-gold hover:text-foreground'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="font-sans-luxe text-xs tracking-widest uppercase text-foreground/60 font-medium">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your requirements or any specific pieces you're interested in..."
                rows={3}
                className="w-full bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-3 font-sans-luxe text-sm text-foreground placeholder:text-foreground/30 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={bookMutation.isPending || (!!date && blockedDates.includes(date))}
              className="w-full bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {bookMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Request Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
