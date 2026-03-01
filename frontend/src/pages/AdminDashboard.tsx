import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, CheckCircle, XCircle, Clock, Calendar, MessageSquare, RotateCcw, LogOut, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AdminLoginForm from '../components/AdminLoginForm';
import {
  getAdminSession,
  useAdminLogout,
  useGetAllFeedback,
  useGetAllAppointments,
  useApproveFeedback,
  useRejectFeedback,
  useResetFeedbackToPending,
  useUpdateAppointmentStatus,
  useBlockDate,
  useUnblockDate,
  useGetBlockedDates,
} from '../hooks/useQueries';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StarRating({ rating }: { rating: bigint }) {
  return (
    <span className="text-gold text-sm">
      {'★'.repeat(Number(rating))}{'☆'.repeat(5 - Number(rating))}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge className="bg-green-100 text-green-800 border-green-200 font-sans text-xs">Approved</Badge>;
  if (status === 'rejected') return <Badge className="bg-red-100 text-red-800 border-red-200 font-sans text-xs">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-sans text-xs">Pending</Badge>;
}

// ─── Feedback Tab ─────────────────────────────────────────────────────────────

function FeedbackTab() {
  const { data: feedbackList, isLoading, isError } = useGetAllFeedback();
  const approveMutation = useApproveFeedback();
  const rejectMutation = useRejectFeedback();
  const resetMutation = useResetFeedbackToPending();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
        <span className="ml-2 text-muted-foreground font-sans text-sm">Loading feedback…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-muted-foreground font-sans text-sm">
        Failed to load feedback. Please refresh.
      </div>
    );
  }

  const sorted = [...(feedbackList ?? [])].sort(
    (a, b) => Number(b.submittedAt) - Number(a.submittedAt)
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground font-sans text-sm">
        No feedback submissions yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground font-sans">
        {sorted.filter(f => {
          const s = Object.keys(f.status)[0];
          return s === 'approved';
        }).length} approved · {sorted.filter(f => {
          const s = Object.keys(f.status)[0];
          return s === 'pending';
        }).length} pending · {sorted.length} total
      </p>

      {sorted.map((feedback) => {
        const statusKey = Object.keys(feedback.status)[0] as 'pending' | 'approved' | 'rejected';
        const isApproving = approveMutation.isPending && approveMutation.variables === feedback.id;
        const isRejecting = rejectMutation.isPending && rejectMutation.variables === feedback.id;
        const isResetting = resetMutation.isPending && resetMutation.variables === feedback.id;
        const isBusy = isApproving || isRejecting || isResetting;

        return (
          <div
            key={feedback.id.toString()}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground font-sans text-sm">{feedback.name}</p>
                <StarRating rating={feedback.rating} />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={statusKey} />
                {statusKey === 'approved' && (
                  <span className="flex items-center gap-1 text-xs text-green-700 font-sans">
                    <Eye className="w-3 h-3" />
                    Visible on website
                  </span>
                )}
              </div>
            </div>

            {/* Review text */}
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">{feedback.review}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground font-sans">
                {formatDate(feedback.submittedAt)}
              </span>

              <div className="flex items-center gap-2">
                {/* Approve — only for pending */}
                {statusKey === 'pending' && (
                  <button
                    onClick={() => approveMutation.mutate(feedback.id)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isApproving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    Approve
                  </button>
                )}

                {/* Reject — for pending or approved */}
                {(statusKey === 'pending' || statusKey === 'approved') && (
                  <button
                    onClick={() => rejectMutation.mutate(feedback.id)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    Reject
                  </button>
                )}

                {/* Reset to pending — for rejected */}
                {statusKey === 'rejected' && (
                  <button
                    onClick={() => resetMutation.mutate(feedback.id)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isResetting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3 h-3" />
                    )}
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────

function AppointmentsTab() {
  const { data: appointments, isLoading, isError } = useGetAllAppointments();
  const updateStatus = useUpdateAppointmentStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
        <span className="ml-2 text-muted-foreground font-sans text-sm">Loading appointments…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-muted-foreground font-sans text-sm">
        Failed to load appointments. Please refresh.
      </div>
    );
  }

  const sorted = [...(appointments ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground font-sans text-sm">
        No appointments booked yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((appt) => {
        const statusKey = Object.keys(appt.status)[0] as 'pending' | 'approved' | 'rejected';
        const isUpdating = updateStatus.isPending;

        return (
          <div key={appt.id.toString()} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground font-sans text-sm">{appt.name}</p>
                <p className="text-xs text-muted-foreground font-sans">{appt.email} · {appt.phone}</p>
              </div>
              <StatusBadge status={statusKey} />
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {appt.date} at {appt.time}
              </span>
            </div>

            {appt.message && (
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">{appt.message}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground font-sans">
                Booked {formatDate(appt.createdAt)}
              </span>
              <div className="flex items-center gap-2">
                {statusKey === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus.mutate({ id: appt.id, status: 'approved' })}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: appt.id, status: 'rejected' })}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                      Reject
                    </button>
                  </>
                )}
                {statusKey !== 'pending' && (
                  <button
                    onClick={() => updateStatus.mutate({ id: appt.id, status: 'pending' })}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold font-sans rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Blocked Dates Tab ────────────────────────────────────────────────────────

function BlockedDatesTab() {
  const { data: blockedDates, isLoading } = useGetBlockedDates();
  const blockDate = useBlockDate();
  const unblockDate = useUnblockDate();
  const [newDate, setNewDate] = useState('');

  const handleBlock = () => {
    if (!newDate) return;
    blockDate.mutate(newDate, {
      onSuccess: () => setNewDate(''),
    });
  };

  return (
    <div className="space-y-6">
      {/* Add blocked date */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground font-sans text-sm mb-3">Block a Date</h3>
        <div className="flex gap-3">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
          <button
            onClick={handleBlock}
            disabled={!newDate || blockDate.isPending}
            className="px-4 py-2 bg-gold text-ivory text-sm font-semibold font-sans rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {blockDate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Block Date
          </button>
        </div>
      </div>

      {/* Blocked dates list */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground font-sans text-sm mb-3">Currently Blocked Dates</h3>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-sans">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : !blockedDates || blockedDates.length === 0 ? (
          <p className="text-muted-foreground text-sm font-sans">No dates are currently blocked.</p>
        ) : (
          <div className="space-y-2">
            {[...blockedDates].sort().map((date) => (
              <div key={date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-sans text-foreground">{date}</span>
                <button
                  onClick={() => unblockDate.mutate(date)}
                  disabled={unblockDate.isPending}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold font-sans transition-colors disabled:opacity-50"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(getAdminSession());
  const logout = useAdminLogout();

  // Sync auth state on mount
  useEffect(() => {
    setIsAuthenticated(getAdminSession());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate({ to: '/' });
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">Luxyle Boutique Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold font-sans text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="feedback">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="feedback" className="font-sans flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="appointments" className="font-sans flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="blocked-dates" className="font-sans flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Blocked Dates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>

          <TabsContent value="blocked-dates">
            <BlockedDatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
