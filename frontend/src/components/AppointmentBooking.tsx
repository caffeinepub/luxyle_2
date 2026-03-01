import { useState } from 'react';
import { CalendarDays, Clock, User, Phone, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitAppointment, useGetBlockedDates } from '../hooks/useQueries';

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
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: blockedDates = [] } = useGetBlockedDates();
  const { mutate: submitAppointment, isPending } = useSubmitAppointment();

  const isDateBlocked = (d: string) => blockedDates.includes(d);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !name.trim() || !phone.trim() || !email.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (isDateBlocked(date)) {
      toast.error('The selected date is not available. Please choose another date.');
      return;
    }
    submitAppointment(
      { date, timeSlot, name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err: Error) => {
          if (err.message?.includes('blocked')) {
            toast.error('This date is blocked. Please select a different date.');
          } else {
            toast.error('Failed to book appointment. Please try again.');
          }
        },
      }
    );
  };

  if (submitted) {
    return (
      <section id="appointment" className="py-24 bg-beige px-6">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle size={48} className="text-gold mx-auto mb-6" />
          <h3 className="font-heading text-3xl text-royal-blue font-light mb-4">
            Appointment Requested
          </h3>
          <div className="gold-divider mb-6" />
          <p className="font-body text-charcoal/70 leading-relaxed">
            Thank you for booking with Luxyle. We will confirm your appointment shortly. Our team
            looks forward to helping you create a beautiful space.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setDate('');
              setTimeSlot('');
              setName('');
              setPhone('');
              setEmail('');
              setMessage('');
            }}
            className="mt-8 font-body text-sm tracking-widest uppercase text-royal-blue border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="py-24 bg-beige px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Schedule a Visit
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-4">
            Book an Appointment
          </h2>
          <div className="gold-divider" />
          <p className="font-body text-charcoal/60 mt-6 text-sm leading-relaxed">
            Visit our showroom and let our experts guide you through our exclusive collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
                <CalendarDays size={14} className="text-gold" />
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={getTodayString()}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTimeSlot('');
                }}
                className={`w-full border-b bg-transparent py-3 font-body text-charcoal focus:outline-none transition-colors ${
                  date && isDateBlocked(date)
                    ? 'border-red-400 text-red-500'
                    : 'border-beige-dark focus:border-gold'
                }`}
                required
              />
              {date && isDateBlocked(date) && (
                <p className="font-body text-xs text-red-500 mt-1">
                  This date is unavailable. Please select another date.
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
                <Clock size={14} className="text-gold" />
                Select Time
              </label>
              {!date || isDateBlocked(date) ? (
                <p className="font-body text-sm text-charcoal/40 py-3 border-b border-beige-dark">
                  {!date ? 'Please select a date first' : 'Date unavailable'}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`font-body text-xs py-2 px-1 border transition-all duration-200 ${
                        timeSlot === slot
                          ? 'border-gold bg-gold text-royal-blue'
                          : 'border-beige-dark text-charcoal/70 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
                <User size={14} className="text-gold" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
                <Phone size={14} className="text-gold" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
              <Mail size={14} className="text-gold" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-charcoal/60 mb-2">
              <MessageSquare size={14} className="text-gold" />
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your space or any specific requirements..."
              rows={3}
              className="w-full border-b border-beige-dark bg-transparent py-3 font-body text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || !date || !timeSlot || isDateBlocked(date)}
              className="flex items-center gap-2 px-10 py-4 bg-royal-blue text-ivory font-body text-sm tracking-widest uppercase hover:bg-royal-blue-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarDays size={16} />
                  Confirm Appointment
                </>
              )}
            </button>
            <p className="font-body text-xs text-charcoal/40 mt-3">
              * All appointments are subject to confirmation. We'll reach out to confirm your booking.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
