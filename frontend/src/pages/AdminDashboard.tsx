import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, CalendarX, CalendarCheck, LogOut } from 'lucide-react';
import {
  useGetAllFeedback,
  useUpdateFeedbackStatus,
  useGetAllAppointments,
  useUpdateAppointmentStatus,
  useGetBlockedDates,
  useBlockDate,
  useUnblockDate,
  useAdminSession,
  type FeedbackStatus,
} from '../hooks/useQueries';
import type { Feedback, Appointment } from '../backend';
import { AppointmentStatus } from '../backend';
import AdminLoginForm from '../components/AdminLoginForm';
import { toast } from 'sonner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(ns: bigint) {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-gold/20 text-gold-dark',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded font-sans-luxe tracking-wide ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function FeedbackTab() {
  const { data: feedbackList = [], isLoading } = useGetAllFeedback();
  const updateStatus = useUpdateFeedbackStatus();

  const handleUpdate = async (id: bigint, status: FeedbackStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Feedback ${status}.`);
    } catch {
      toast.error('Failed to update feedback status.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" size={28} /></div>;

  return (
    <div className="space-y-4">
      {feedbackList.length === 0 && (
        <p className="text-center font-sans-luxe text-sm text-foreground/50 font-medium py-8">No feedback submissions yet.</p>
      )}
      {feedbackList.map((fb: Feedback) => (
        <div key={fb.id.toString()} className="bg-cream border border-gold/20 p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-base font-semibold text-royal-blue">{fb.name}</p>
              <p className="font-sans-luxe text-xs text-foreground/40 font-medium">{formatTime(fb.submittedAt)}</p>
            </div>
            <StatusBadge status={fb.status as string} />
          </div>
          <p className="font-sans-luxe text-sm text-foreground/70 font-medium italic">"{fb.review}"</p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleUpdate(fb.id, 'approved')}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-sans-luxe text-xs tracking-wide font-semibold transition-colors disabled:opacity-50"
            >
              <CheckCircle size={12} /> Approve
            </button>
            <button
              onClick={() => handleUpdate(fb.id, 'rejected')}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-sans-luxe text-xs tracking-wide font-semibold transition-colors disabled:opacity-50"
            >
              <XCircle size={12} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentsTab() {
  const { data: appointments = [], isLoading } = useGetAllAppointments();
  const updateStatus = useUpdateAppointmentStatus();

  const handleUpdate = async (id: bigint, status: AppointmentStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Appointment ${status}.`);
    } catch {
      toast.error('Failed to update appointment status.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" size={28} /></div>;

  return (
    <div className="space-y-4">
      {appointments.length === 0 && (
        <p className="text-center font-sans-luxe text-sm text-foreground/50 font-medium py-8">No appointments booked yet.</p>
      )}
      {appointments.map((apt: Appointment) => (
        <div key={apt.id.toString()} className="bg-cream border border-gold/20 p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-base font-semibold text-royal-blue">{apt.name}</p>
              <p className="font-sans-luxe text-xs text-foreground/40 font-medium">{apt.email} · {apt.phone}</p>
            </div>
            <StatusBadge status={apt.status as string} />
          </div>
          <div className="flex gap-4 font-sans-luxe text-xs text-foreground/60 font-medium">
            <span>📅 {formatDate(apt.date)}</span>
            <span>🕐 {apt.time}</span>
          </div>
          {apt.message && (
            <p className="font-sans-luxe text-sm text-foreground/60 font-medium italic">"{apt.message}"</p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleUpdate(apt.id, AppointmentStatus.approved)}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-sans-luxe text-xs tracking-wide font-semibold transition-colors disabled:opacity-50"
            >
              <CalendarCheck size={12} /> Approve
            </button>
            <button
              onClick={() => handleUpdate(apt.id, AppointmentStatus.rejected)}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-sans-luxe text-xs tracking-wide font-semibold transition-colors disabled:opacity-50"
            >
              <CalendarX size={12} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockedDatesTab() {
  const { data: blockedDates = [], isLoading } = useGetBlockedDates();
  const blockDate = useBlockDate();
  const unblockDate = useUnblockDate();
  const [newDate, setNewDate] = useState('');

  const handleBlock = async () => {
    if (!newDate) return;
    try {
      await blockDate.mutateAsync(newDate);
      toast.success(`Date ${newDate} blocked.`);
      setNewDate('');
    } catch {
      toast.error('Failed to block date.');
    }
  };

  const handleUnblock = async (date: string) => {
    try {
      await unblockDate.mutateAsync(date);
      toast.success(`Date ${date} unblocked.`);
    } catch {
      toast.error('Failed to unblock date.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" size={28} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 bg-cream border border-gold/30 focus:border-gold outline-none px-4 py-2.5 font-sans-luxe text-sm text-foreground transition-colors"
        />
        <button
          onClick={handleBlock}
          disabled={!newDate || blockDate.isPending}
          className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-foreground font-sans-luxe text-xs tracking-[0.15em] uppercase font-semibold px-5 py-2.5 transition-colors disabled:opacity-50"
        >
          {blockDate.isPending && <Loader2 size={12} className="animate-spin" />}
          Block Date
        </button>
      </div>

      {blockedDates.length === 0 && (
        <p className="text-center font-sans-luxe text-sm text-foreground/50 font-medium py-8">No dates are currently blocked.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...blockedDates].sort().map((date) => (
          <div key={date} className="bg-cream border border-gold/20 p-3 flex items-center justify-between gap-2">
            <span className="font-sans-luxe text-xs text-foreground/70 font-medium">{formatDate(date)}</span>
            <button
              onClick={() => handleUnblock(date)}
              disabled={unblockDate.isPending}
              className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              aria-label="Unblock date"
            >
              <XCircle size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, setAuthenticated } = useAdminSession();
  const [activeTab, setActiveTab] = useState<'feedback' | 'appointments' | 'blocked'>('feedback');
  // Local state to force re-render after login/logout
  const [, setAuthVersion] = useState(0);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setAuthVersion((v) => v + 1);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setAuthVersion((v) => v + 1);
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={handleLoginSuccess} />;
  }

  const TABS = [
    { id: 'feedback' as const, label: 'Feedback' },
    { id: 'appointments' as const, label: 'Appointments' },
    { id: 'blocked' as const, label: 'Blocked Dates' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-ivory">
      <div className="container-luxe max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-royal-blue">Admin Dashboard</h1>
            <p className="font-sans-luxe text-xs tracking-widest uppercase text-gold-dark mt-1 font-semibold">
              Manage your Luxyle store
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans-luxe text-xs tracking-widest uppercase font-semibold text-foreground/50 hover:text-foreground transition-colors border border-foreground/20 hover:border-foreground/40 px-4 py-2"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold/20 mb-8 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-sans-luxe text-xs tracking-[0.15em] uppercase font-semibold px-5 py-3 transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-gold text-gold-dark'
                  : 'border-transparent text-foreground/50 hover:text-foreground/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'feedback' && <FeedbackTab />}
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'blocked' && <BlockedDatesTab />}
      </div>
    </div>
  );
}
