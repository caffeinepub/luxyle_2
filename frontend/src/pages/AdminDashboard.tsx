import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminLoginForm from '../components/AdminLoginForm';
import {
  useGetAllAppointments,
  useGetAllFeedback,
  useUpdateAppointmentStatus,
  useUpdateFeedbackStatus,
  useBlockDate,
  useUnblockDate,
  useGetBlockedDates,
  getAdminSession,
  setAdminSession,
  type FeedbackStatus,
} from '../hooks/useQueries';
import type { Appointment, Feedback } from '../backend';
import { AppointmentStatus } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  MessageSquare,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === 'pending') {
    return (
      <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50 font-semibold">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
  }
  if (status === 'approved') {
    return (
      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 font-semibold">
        <CheckCircle className="w-3 h-3 mr-1" /> Approved
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-red-400 text-red-700 bg-red-50 font-semibold">
      <XCircle className="w-3 h-3 mr-1" /> Rejected
    </Badge>
  );
}

// Helper to normalize status from backend (handles both string and variant object)
function getStatusStr(status: unknown): string {
  if (typeof status === 'string') return status;
  if (typeof status === 'object' && status !== null) return Object.keys(status)[0];
  return 'unknown';
}

// ─── Filter Buttons ───────────────────────────────────────────────────────────
function FilterBar({
  filter,
  setFilter,
  counts,
}: {
  filter: StatusFilter;
  setFilter: (f: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}) {
  const options: StatusFilter[] = ['all', 'pending', 'approved', 'rejected'];
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {options.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            filter === f
              ? 'bg-gold text-ivory border-gold'
              : 'bg-transparent text-foreground border-border hover:border-gold'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
          <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
        </button>
      ))}
    </div>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────
function AppointmentsTab() {
  const { data: appointments, isLoading, isError, error, refetch } = useGetAllAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const all = appointments ?? [];
  const filtered = filter === 'all' ? all : all.filter((a) => getStatusStr(a.status) === filter);

  const counts: Record<StatusFilter, number> = {
    all: all.length,
    pending: all.filter((a) => getStatusStr(a.status) === 'pending').length,
    approved: all.filter((a) => getStatusStr(a.status) === 'approved').length,
    rejected: all.filter((a) => getStatusStr(a.status) === 'rejected').length,
  };

  const handleStatus = (id: bigint, status: AppointmentStatus) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600 font-semibold">Failed to load appointments</p>
        <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <Calendar className="w-12 h-12 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground font-medium">No appointments found</p>
          {filter !== 'all' && (
            <p className="text-sm text-muted-foreground">No {filter} appointments at this time.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt: Appointment) => {
            const statusStr = getStatusStr(appt.status);
            return (
              <div
                key={String(appt.id)}
                className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground">{appt.name}</span>
                      <StatusBadge status={statusStr} />
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>📞 {appt.phone} &nbsp;|&nbsp; ✉️ {appt.email}</p>
                      <p>📅 {appt.date} &nbsp;|&nbsp; 🕐 {appt.time}</p>
                      {appt.message && (
                        <p className="mt-1 text-foreground/70 italic">"{appt.message}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {statusStr !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-700 hover:bg-green-50 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(appt.id, AppointmentStatus.approved)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {statusStr !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-700 hover:bg-red-50 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(appt.id, AppointmentStatus.rejected)}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    )}
                    {statusStr !== 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-amber-600 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(appt.id, AppointmentStatus.pending)}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Feedback Tab ─────────────────────────────────────────────────────────────
function FeedbackTab() {
  const { data: feedbackList, isLoading, isError, error, refetch } = useGetAllFeedback();
  const updateStatus = useUpdateFeedbackStatus();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const all = feedbackList ?? [];
  const filtered = filter === 'all' ? all : all.filter((f) => getStatusStr(f.status) === filter);

  const counts: Record<StatusFilter, number> = {
    all: all.length,
    pending: all.filter((f) => getStatusStr(f.status) === 'pending').length,
    approved: all.filter((f) => getStatusStr(f.status) === 'approved').length,
    rejected: all.filter((f) => getStatusStr(f.status) === 'rejected').length,
  };

  const handleStatus = (id: bigint, status: FeedbackStatus) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600 font-semibold">Failed to load feedback</p>
        <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground font-medium">No feedback found</p>
          {filter !== 'all' && (
            <p className="text-sm text-muted-foreground">No {filter} feedback at this time.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((fb: Feedback) => {
            const statusStr = getStatusStr(fb.status);
            return (
              <div
                key={String(fb.id)}
                className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground">{fb.name}</span>
                      <StatusBadge status={statusStr} />
                      <span className="text-amber-500 text-sm font-semibold">
                        {'★'.repeat(Number(fb.rating))}{'☆'.repeat(5 - Number(fb.rating))}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70 italic">"{fb.review}"</p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    {statusStr !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-700 hover:bg-green-50 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(fb.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {statusStr !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-700 hover:bg-red-50 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(fb.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    )}
                    {statusStr !== 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-amber-600 font-semibold"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatus(fb.id, 'pending')}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
    blockDate.mutate(newDate, { onSuccess: () => setNewDate('') });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <Button
          onClick={handleBlock}
          disabled={!newDate || blockDate.isPending}
          className="bg-gold text-ivory hover:bg-gold/90 font-semibold"
        >
          {blockDate.isPending ? 'Blocking...' : 'Block Date'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-48 rounded-lg" />)}
        </div>
      ) : (blockedDates ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <Calendar className="w-10 h-10 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground font-medium">No blocked dates</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(blockedDates ?? []).map((date) => (
            <div
              key={date}
              className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-card text-sm"
            >
              <span className="font-medium">{date}</span>
              <button
                onClick={() => unblockDate.mutate(date)}
                disabled={unblockDate.isPending}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Unblock date"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(getAdminSession());
  const queryClient = useQueryClient();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Invalidate so queries re-run now that admin session is set
    queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    queryClient.clear();
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Manage appointments, feedback, and availability
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-border text-foreground hover:bg-muted font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6 bg-muted/50 border border-border rounded-xl p-1">
            <TabsTrigger
              value="appointments"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <Users className="w-4 h-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <MessageSquare className="w-4 h-4" /> Feedback
            </TabsTrigger>
            <TabsTrigger
              value="blocked-dates"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
            >
              <Calendar className="w-4 h-4" /> Blocked Dates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>
          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>
          <TabsContent value="blocked-dates">
            <BlockedDatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
