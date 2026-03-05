import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CalendarX,
  CheckCircle,
  Loader2,
  LogOut,
  Star,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { type Appointment, type Feedback, FeedbackStatus } from "../backend";
import AdminLoginForm from "../components/AdminLoginForm";
import {
  useAddBlockedDate,
  useApproveAppointment,
  useApproveFeedback,
  useGetBlockedDates,
  useGetDashboardData,
  useRejectAppointment,
  useRejectFeedback,
  useRemoveBlockedDate,
} from "../hooks/useQueries";

const CREDENTIAL_KEY = "luxyle_dashboard_auth";

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
      Pending
    </Badge>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: bigint }) {
  const n = Number(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= n ? "fill-gold text-gold" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────
function AppointmentsTab() {
  const { data: dashboard, isLoading, isError } = useGetDashboardData();
  const approveAppointment = useApproveAppointment();
  const rejectAppointment = useRejectAppointment();

  const appointments: Appointment[] = dashboard?.appointments ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-jost">
        Failed to load appointments. Please ensure you have admin access.
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-12 h-12 text-gold/40 mx-auto mb-4" />
        <p className="text-charcoal/50 font-jost text-lg">
          No appointment requests yet.
        </p>
        <p className="text-charcoal/30 font-jost text-sm mt-1">
          Appointments submitted on the main website will appear here.
        </p>
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal/50 font-jost mb-2">
        {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}{" "}
        total
      </p>
      {sorted.map((appt) => (
        <div
          key={String(appt.id)}
          className="bg-white border border-gold/15 rounded-lg p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-cormorant text-lg font-semibold text-charcoal">
                  {appt.name}
                </h3>
                <StatusBadge status={appt.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-charcoal/70 font-jost">
                <span className="flex items-center gap-1.5">
                  <span>📅</span>
                  <span>
                    {appt.date} — {appt.timeSlot}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>📞</span>
                  <span>{appt.phone}</span>
                </span>
                {appt.email && (
                  <span className="flex items-center gap-1.5">
                    <span>✉️</span>
                    <span>{appt.email}</span>
                  </span>
                )}
                {appt.message && (
                  <span className="flex items-center gap-1.5 sm:col-span-2">
                    <span>💬</span>
                    <span className="italic">{appt.message}</span>
                  </span>
                )}
              </div>
            </div>
            {appt.status === "pending" && (
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-50"
                  disabled={approveAppointment.isPending}
                  onClick={() => approveAppointment.mutate(appt.id)}
                >
                  {approveAppointment.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50"
                  disabled={rejectAppointment.isPending}
                  onClick={() => rejectAppointment.mutate(appt.id)}
                >
                  {rejectAppointment.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Feedback Tab ──────────────────────────────────────────────────────────────
function FeedbackTab() {
  const { data: dashboard, isLoading, isError } = useGetDashboardData();
  const approveFeedback = useApproveFeedback();
  const rejectFeedback = useRejectFeedback();

  const feedbacks: Feedback[] = dashboard?.feedbacks ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-jost">
        Failed to load feedback. Please ensure you have admin access.
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-16">
        <Star className="w-12 h-12 text-gold/40 mx-auto mb-4" />
        <p className="text-charcoal/50 font-jost text-lg">
          No feedback submissions yet.
        </p>
        <p className="text-charcoal/30 font-jost text-sm mt-1">
          Feedback submitted on the main website will appear here.
        </p>
      </div>
    );
  }

  const sorted = [...feedbacks].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal/50 font-jost mb-2">
        {feedbacks.length} feedback entr{feedbacks.length !== 1 ? "ies" : "y"}{" "}
        total
      </p>
      {sorted.map((fb) => (
        <div
          key={String(fb.id)}
          className="bg-white border border-gold/15 rounded-lg p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-cormorant text-lg font-semibold text-charcoal">
                  {fb.name}
                </h3>
                <StarRating rating={fb.rating} />
                <StatusBadge status={fb.status} />
              </div>
              <p className="text-sm text-charcoal/70 font-jost leading-relaxed">
                {fb.review}
              </p>
            </div>
            {fb.status === FeedbackStatus.pending && (
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-50"
                  disabled={approveFeedback.isPending}
                  onClick={() => approveFeedback.mutate(fb.id)}
                >
                  {approveFeedback.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50"
                  disabled={rejectFeedback.isPending}
                  onClick={() => rejectFeedback.mutate(fb.id)}
                >
                  {rejectFeedback.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  Reject
                </Button>
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
  const [newDate, setNewDate] = useState("");
  const { data: blockedDates = [], isLoading } = useGetBlockedDates();
  const addBlockedDate = useAddBlockedDate();
  const removeBlockedDate = useRemoveBlockedDate();

  const handleAdd = () => {
    if (!newDate) return;
    addBlockedDate.mutate(newDate, { onSuccess: () => setNewDate("") });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 border border-gold/30 rounded px-3 py-2 font-jost text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <Button
          onClick={handleAdd}
          disabled={!newDate || addBlockedDate.isPending}
          className="bg-gold hover:bg-gold/90 text-white font-jost"
        >
          {addBlockedDate.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Block Date"
          )}
        </Button>
      </div>

      {blockedDates.length === 0 ? (
        <div className="text-center py-12">
          <CalendarX className="w-12 h-12 text-gold/40 mx-auto mb-4" />
          <p className="text-charcoal/50 font-jost">
            No dates are currently blocked.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...blockedDates].sort().map((date) => (
            <div
              key={date}
              className="flex items-center justify-between bg-white border border-gold/15 rounded px-4 py-3"
            >
              <span className="font-jost text-charcoal">{date}</span>
              <Button
                size="sm"
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-50"
                disabled={removeBlockedDate.isPending}
                onClick={() => removeBlockedDate.mutate(date)}
              >
                {removeBlockedDate.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                Unblock
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // Credential-based auth state (frontend-only gate)
  const [credentialAuthed, setCredentialAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(CREDENTIAL_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [authedUsername, setAuthedUsername] = useState<string>(() => {
    try {
      return sessionStorage.getItem(`${CREDENTIAL_KEY}_user`) ?? "";
    } catch {
      return "";
    }
  });

  const handleCredentialSuccess = (username: string) => {
    try {
      sessionStorage.setItem(CREDENTIAL_KEY, "true");
      sessionStorage.setItem(`${CREDENTIAL_KEY}_user`, username);
    } catch {
      // ignore storage errors
    }
    setAuthedUsername(username);
    setCredentialAuthed(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(CREDENTIAL_KEY);
      sessionStorage.removeItem(`${CREDENTIAL_KEY}_user`);
    } catch {
      // ignore
    }
    setCredentialAuthed(false);
    setAuthedUsername("");
    queryClient.clear();
  };

  // Show credential login form if not yet authenticated
  if (!credentialAuthed) {
    return <AdminLoginForm onSuccess={handleCredentialSuccess} />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-white border-b border-gold/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-cormorant text-2xl font-bold text-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-xs text-charcoal/50 font-jost mt-0.5">
              Welcome,{" "}
              <span className="text-gold font-medium">{authedUsername}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-gold/30 text-charcoal hover:bg-gold/5 font-jost"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6 bg-white border border-gold/20 p-1 rounded-lg">
            <TabsTrigger
              value="appointments"
              className="font-jost data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="font-jost data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              Feedback
            </TabsTrigger>
            <TabsTrigger
              value="blocked-dates"
              className="font-jost data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              Blocked Dates
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
