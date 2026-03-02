import { useState, useEffect } from 'react';
import {
  useGetDashboardData,
  useApproveFeedback,
  useRejectFeedback,
  useApproveAppointment,
  useRejectAppointment,
  useGetBlockedDates,
  useAddBlockedDate,
  useRemoveBlockedDate,
} from '../hooks/useQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Star,
  CalendarX,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  LogOut,
  MessageSquare,
  CalendarCheck,
  Clock,
} from 'lucide-react';
import type { Feedback, Appointment } from '../backend';
import { FeedbackStatus } from '../backend';
import AdminLoginForm from '../components/AdminLoginForm';

const DASHBOARD_SESSION_KEY = 'dashboard_session';

// ── Star Display ─────────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'text-gold fill-gold' : 'text-beige-dark'} />
      ))}
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Approved</Badge>;
  }
  if (status === 'rejected') {
    return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Rejected</Badge>;
  }
  return <Badge className="bg-gold/20 text-gold-dark border-gold/30 text-xs">Pending</Badge>;
}

// ── Feedback Tab ─────────────────────────────────────────────────────────────

function FeedbackTab({ feedbacks, isLoading }: { feedbacks: Feedback[]; isLoading: boolean }) {
  const { mutate: approve, isPending: approving } = useApproveFeedback();
  const { mutate: reject, isPending: rejecting } = useRejectFeedback();
  const [actionId, setActionId] = useState<bigint | null>(null);

  const handleApprove = (id: bigint) => {
    setActionId(id);
    approve(id, {
      onSuccess: () => { toast.success('Feedback approved'); setActionId(null); },
      onError: () => { toast.error('Failed to approve feedback'); setActionId(null); },
    });
  };

  const handleReject = (id: bigint) => {
    setActionId(id);
    reject(id, {
      onSuccess: () => { toast.success('Feedback rejected'); setActionId(null); },
      onError: () => { toast.error('Failed to reject feedback'); setActionId(null); },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (!feedbacks.length) {
    return (
      <div className="text-center py-16">
        <MessageSquare size={40} className="text-gold mx-auto mb-4" />
        <p className="font-heading text-xl text-royal-blue font-light">No feedback yet</p>
        <p className="font-body text-sm text-charcoal/50 mt-2">Customer feedback will appear here once submitted.</p>
      </div>
    );
  }

  const sorted = [...feedbacks].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="space-y-4">
      {sorted.map((fb: Feedback) => (
        <div key={String(fb.id)} className="bg-ivory p-6 border-l-4 border-gold shadow-luxury">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-heading text-royal-blue font-medium">{fb.name}</span>
                <StarDisplay rating={Number(fb.rating)} />
                <StatusBadge status={fb.status} />
              </div>
              <p className="font-body text-sm text-charcoal/70 italic">"{fb.review}"</p>
              <p className="font-body text-xs text-charcoal/40 mt-2 flex items-center gap-1">
                <Clock size={11} />
                {new Date(Number(fb.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            {fb.status === FeedbackStatus.pending && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(fb.id)}
                  disabled={(approving || rejecting) && actionId === fb.id}
                  className="flex items-center gap-1 px-3 py-2 bg-royal-blue text-ivory font-body text-xs tracking-wide hover:bg-royal-blue-light transition-colors disabled:opacity-50"
                >
                  {approving && actionId === fb.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(fb.id)}
                  disabled={(approving || rejecting) && actionId === fb.id}
                  className="flex items-center gap-1 px-3 py-2 border border-red-400 text-red-500 font-body text-xs tracking-wide hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {rejecting && actionId === fb.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────

function AppointmentsTab({ appointments, isLoading }: { appointments: Appointment[]; isLoading: boolean }) {
  const { mutate: approve, isPending: approving } = useApproveAppointment();
  const { mutate: reject, isPending: rejecting } = useRejectAppointment();
  const [actionId, setActionId] = useState<bigint | null>(null);

  const handleApprove = (id: bigint) => {
    setActionId(id);
    approve(id, {
      onSuccess: () => { toast.success('Appointment approved'); setActionId(null); },
      onError: () => { toast.error('Failed to approve appointment'); setActionId(null); },
    });
  };

  const handleReject = (id: bigint) => {
    setActionId(id);
    reject(id, {
      onSuccess: () => { toast.success('Appointment rejected'); setActionId(null); },
      onError: () => { toast.error('Failed to reject appointment'); setActionId(null); },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="text-center py-16">
        <CalendarX size={40} className="text-gold mx-auto mb-4" />
        <p className="font-heading text-xl text-royal-blue font-light">No appointments yet</p>
        <p className="font-body text-sm text-charcoal/50 mt-2">Appointments will appear here once submitted.</p>
      </div>
    );
  }

  const sorted = [...appointments].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="space-y-4">
      {sorted.map((appt: Appointment) => (
        <div key={String(appt.id)} className="bg-ivory p-6 border-l-4 border-gold shadow-luxury">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="font-heading text-royal-blue font-medium text-lg">{appt.name}</span>
                <StatusBadge status={appt.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs font-body text-charcoal/60 mb-2">
                <span className="flex items-center gap-1">
                  <span className="text-gold">📅</span> {appt.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gold">🕐</span> {appt.timeSlot}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gold">📞</span> {appt.phone}
                </span>
                <span className="flex items-center gap-1 col-span-2 md:col-span-1">
                  <span className="text-gold">✉️</span>
                  <span className="truncate">{appt.email}</span>
                </span>
              </div>
              {appt.message && (
                <p className="font-body text-xs text-charcoal/50 mt-2 italic border-l-2 border-beige-dark pl-3">
                  "{appt.message}"
                </p>
              )}
              <p className="font-body text-xs text-charcoal/35 mt-2 flex items-center gap-1">
                <Clock size={11} />
                Submitted: {new Date(Number(appt.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            {appt.status === 'pending' && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(appt.id)}
                  disabled={(approving || rejecting) && actionId === appt.id}
                  className="flex items-center gap-1 px-3 py-2 bg-royal-blue text-ivory font-body text-xs tracking-wide hover:bg-royal-blue-light transition-colors disabled:opacity-50"
                >
                  {approving && actionId === appt.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(appt.id)}
                  disabled={(approving || rejecting) && actionId === appt.id}
                  className="flex items-center gap-1 px-3 py-2 border border-red-400 text-red-500 font-body text-xs tracking-wide hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {rejecting && actionId === appt.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Blocked Dates Tab ─────────────────────────────────────────────────────────

function BlockedDatesTab() {
  const { data: blockedDates = [], isLoading } = useGetBlockedDates();
  const { mutate: addDate, isPending: adding } = useAddBlockedDate();
  const { mutate: removeDate, isPending: removing } = useRemoveBlockedDate();
  const [newDate, setNewDate] = useState('');
  const [removingDate, setRemovingDate] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newDate) return;
    addDate(newDate, {
      onSuccess: () => { toast.success(`Date ${newDate} blocked`); setNewDate(''); },
      onError: () => toast.error('Failed to block date'),
    });
  };

  const handleRemove = (date: string) => {
    setRemovingDate(date);
    removeDate(date, {
      onSuccess: () => { toast.success(`Date ${date} unblocked`); setRemovingDate(null); },
      onError: () => { toast.error('Failed to unblock date'); setRemovingDate(null); },
    });
  };

  return (
    <div className="space-y-8">
      {/* Add Date */}
      <div className="bg-ivory p-6 border-t-2 border-gold shadow-luxury">
        <h3 className="font-heading text-xl text-royal-blue font-light mb-4">Block a Date</h3>
        <div className="flex gap-3">
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 border-b border-beige-dark bg-transparent py-2 font-body text-charcoal focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!newDate || adding}
            className="flex items-center gap-2 px-5 py-2 bg-royal-blue text-ivory font-body text-sm tracking-wide hover:bg-royal-blue-light transition-colors disabled:opacity-50"
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Block Date
          </button>
        </div>
      </div>

      {/* Blocked Dates List */}
      <div>
        <h3 className="font-heading text-xl text-royal-blue font-light mb-4">Currently Blocked Dates</h3>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : blockedDates.length === 0 ? (
          <p className="font-body text-sm text-charcoal/50 py-4">No dates are currently blocked.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...blockedDates].sort().map((date) => (
              <div
                key={date}
                className="flex items-center justify-between bg-ivory px-4 py-3 border border-beige-dark shadow-luxury"
              >
                <span className="font-body text-sm text-charcoal">{date}</span>
                <button
                  onClick={() => handleRemove(date)}
                  disabled={removing && removingDate === date}
                  className="text-red-400 hover:text-red-600 transition-colors ml-2 disabled:opacity-50"
                  aria-label={`Unblock ${date}`}
                >
                  {removing && removingDate === date
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Content (rendered only when logged in) ──────────────────────────

function DashboardContent({ username, onSignOut }: { username: string; onSignOut: () => void }) {
  const { data: dashboardData, isLoading } = useGetDashboardData();

  const allAppointments = dashboardData?.appointments ?? [];
  const allFeedbacks = dashboardData?.feedbacks ?? [];

  const pendingAppointments = allAppointments.filter(a => a.status === 'pending').length;
  const pendingFeedbacks = allFeedbacks.filter(f => f.status === FeedbackStatus.pending).length;

  return (
    <div className="min-h-screen bg-beige pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide">
              Dashboard
            </h1>
            <div className="gold-divider mt-3 mb-2" />
            <p className="font-body text-sm text-charcoal/50 tracking-wide">
              Welcome, <span className="text-royal-blue font-medium">{username}</span> — manage appointments, feedback, and availability
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 text-charcoal/60 font-body text-sm tracking-wide hover:border-red-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-ivory p-5 border-t-2 border-gold shadow-luxury text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <p className="font-heading text-3xl text-royal-blue font-light">{allAppointments.length}</p>
            )}
            <p className="font-body text-xs text-charcoal/50 tracking-widest uppercase mt-1">Total Appointments</p>
          </div>
          <div className="bg-ivory p-5 border-t-2 border-gold shadow-luxury text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <p className="font-heading text-3xl text-gold-dark font-light">{pendingAppointments}</p>
            )}
            <p className="font-body text-xs text-charcoal/50 tracking-widest uppercase mt-1">Pending Appointments</p>
          </div>
          <div className="bg-ivory p-5 border-t-2 border-gold shadow-luxury text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <p className="font-heading text-3xl text-royal-blue font-light">{allFeedbacks.length}</p>
            )}
            <p className="font-body text-xs text-charcoal/50 tracking-widest uppercase mt-1">Total Feedback</p>
          </div>
          <div className="bg-ivory p-5 border-t-2 border-gold shadow-luxury text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <p className="font-heading text-3xl text-gold-dark font-light">{pendingFeedbacks}</p>
            )}
            <p className="font-body text-xs text-charcoal/50 tracking-widest uppercase mt-1">Pending Feedback</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments">
          <TabsList className="bg-ivory border border-beige-dark mb-8 h-auto p-1 gap-1 flex-wrap">
            <TabsTrigger
              value="appointments"
              className="font-body text-xs tracking-widest uppercase px-6 py-3 data-[state=active]:bg-royal-blue data-[state=active]:text-ivory"
            >
              <CalendarCheck size={14} className="mr-2" />
              Appointments
              {pendingAppointments > 0 && (
                <span className="ml-2 bg-gold text-ivory text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {pendingAppointments}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="feedbacks"
              className="font-body text-xs tracking-widest uppercase px-6 py-3 data-[state=active]:bg-royal-blue data-[state=active]:text-ivory"
            >
              <MessageSquare size={14} className="mr-2" />
              Feedbacks
              {pendingFeedbacks > 0 && (
                <span className="ml-2 bg-gold text-ivory text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {pendingFeedbacks}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="blocked-dates"
              className="font-body text-xs tracking-widest uppercase px-6 py-3 data-[state=active]:bg-royal-blue data-[state=active]:text-ivory"
            >
              <CalendarX size={14} className="mr-2" />
              Blocked Dates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsTab appointments={allAppointments} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="feedbacks">
            <FeedbackTab feedbacks={allFeedbacks} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="blocked-dates">
            <BlockedDatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Admin Dashboard Page ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DASHBOARD_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [username, setUsername] = useState<string>(() => {
    try {
      return sessionStorage.getItem('dashboard_username') ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      if (isLoggedIn) {
        sessionStorage.setItem(DASHBOARD_SESSION_KEY, 'true');
      } else {
        sessionStorage.removeItem(DASHBOARD_SESSION_KEY);
        sessionStorage.removeItem('dashboard_username');
      }
    } catch {
      // ignore storage errors
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (user: string) => {
    try {
      sessionStorage.setItem('dashboard_username', user);
    } catch {
      // ignore
    }
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  if (!isLoggedIn) {
    return <AdminLoginForm onSuccess={handleLoginSuccess} />;
  }

  return <DashboardContent username={username} onSignOut={handleSignOut} />;
}
