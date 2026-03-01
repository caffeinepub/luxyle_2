import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useIsCallerAdmin,
  useGetAllFeedback,
  useGetPendingFeedback,
  useApproveFeedback,
  useRejectFeedback,
  useGetAllAppointments,
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
import { Star, CalendarX, Plus, Trash2, Loader2, CheckCircle, XCircle, LogOut } from 'lucide-react';
import type { Feedback, Appointment } from '../backend';
import { AppointmentStatus } from '../backend';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? 'text-gold fill-gold' : 'text-beige-dark'} />
      ))}
    </div>
  );
}

function FeedbackTab() {
  const { data: pendingFeedback, isLoading } = useGetPendingFeedback();
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
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!pendingFeedback?.length) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-gold mx-auto mb-4" />
        <p className="font-heading text-xl text-royal-blue font-light">No pending feedback</p>
        <p className="font-body text-sm text-charcoal/50 mt-2">All feedback has been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingFeedback.map((fb: Feedback) => (
        <div key={String(fb.id)} className="bg-ivory p-6 border-l-4 border-gold shadow-luxury">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-heading text-royal-blue font-medium">{fb.name}</span>
                <StarDisplay rating={Number(fb.rating)} />
              </div>
              <p className="font-body text-sm text-charcoal/70 italic">"{fb.review}"</p>
              <p className="font-body text-xs text-charcoal/40 mt-2">
                {new Date(Number(fb.createdAt) / 1_000_000).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleApprove(fb.id)}
                disabled={approving && actionId === fb.id}
                className="flex items-center gap-1 px-3 py-2 bg-royal-blue text-ivory font-body text-xs tracking-wide hover:bg-royal-blue-light transition-colors disabled:opacity-50"
              >
                {approving && actionId === fb.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                Approve
              </button>
              <button
                onClick={() => handleReject(fb.id)}
                disabled={rejecting && actionId === fb.id}
                className="flex items-center gap-1 px-3 py-2 border border-red-400 text-red-500 font-body text-xs tracking-wide hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {rejecting && actionId === fb.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentsTab() {
  const { data: appointments, isLoading } = useGetAllAppointments();
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

  const statusBadge = (status: AppointmentStatus) => {
    if (status === AppointmentStatus.approved) return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
    if (status === AppointmentStatus.rejected) return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
    return <Badge className="bg-gold/20 text-gold-dark border-gold/30">Pending</Badge>;
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

  if (!appointments?.length) {
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
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-heading text-royal-blue font-medium">{appt.name}</span>
                {statusBadge(appt.status)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-body text-charcoal/60">
                <span>📅 {appt.date}</span>
                <span>🕐 {appt.timeSlot}</span>
                <span>📞 {appt.phone}</span>
                <span>✉️ {appt.email}</span>
              </div>
              {appt.message && (
                <p className="font-body text-xs text-charcoal/50 mt-2 italic">"{appt.message}"</p>
              )}
            </div>
            {appt.status === AppointmentStatus.pending && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(appt.id)}
                  disabled={approving && actionId === appt.id}
                  className="flex items-center gap-1 px-3 py-2 bg-royal-blue text-ivory font-body text-xs tracking-wide hover:bg-royal-blue-light transition-colors disabled:opacity-50"
                >
                  {approving && actionId === appt.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(appt.id)}
                  disabled={rejecting && actionId === appt.id}
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
                  {removing && removingDate === date ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-ivory p-10 shadow-luxury-lg border-t-4 border-gold text-center">
          <h1 className="font-heading text-4xl text-royal-blue font-light mb-2">Admin Portal</h1>
          <div className="gold-divider mb-6" />
          <p className="font-body text-sm text-charcoal/60 mb-8">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-royal-blue text-ivory font-body text-sm tracking-widest uppercase hover:bg-royal-blue-light transition-all duration-300 disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 size={32} className="text-gold animate-spin mx-auto mb-4" />
          <p className="font-body text-charcoal/60">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-ivory p-10 shadow-luxury-lg border-t-4 border-red-400 text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-heading text-3xl text-royal-blue font-light mb-4">Access Denied</h2>
          <p className="font-body text-sm text-charcoal/60 mb-8">
            You do not have admin privileges to access this dashboard.
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mx-auto px-6 py-3 border border-royal-blue text-royal-blue font-body text-sm tracking-wide hover:bg-royal-blue hover:text-ivory transition-all duration-300"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-beige pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-4xl text-royal-blue font-light">Admin Dashboard</h1>
            <div className="gold-divider-left mt-2" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 border border-royal-blue text-royal-blue font-body text-sm tracking-wide hover:bg-royal-blue hover:text-ivory transition-all duration-300"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        <Tabs defaultValue="feedback">
          <TabsList className="bg-ivory border border-beige-dark mb-8 h-auto p-1">
            <TabsTrigger
              value="feedback"
              className="font-body text-sm tracking-widest uppercase data-[state=active]:bg-royal-blue data-[state=active]:text-ivory px-6 py-3"
            >
              Feedback
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="font-body text-sm tracking-widest uppercase data-[state=active]:bg-royal-blue data-[state=active]:text-ivory px-6 py-3"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="blocked"
              className="font-body text-sm tracking-widest uppercase data-[state=active]:bg-royal-blue data-[state=active]:text-ivory px-6 py-3"
            >
              Blocked Dates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>
          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>
          <TabsContent value="blocked">
            <BlockedDatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
