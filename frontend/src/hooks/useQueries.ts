import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

// ─── Admin Auth (session stored in sessionStorage) ───────────────────────────

const SESSION_KEY = 'luxyle_admin_session';

export function getAdminSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function setAdminSession(value: boolean) {
  if (value) {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const success = await actor.adminLogin(username, password);
      if (!success) throw new Error('Invalid username or password');
      return success;
    },
    onSuccess: () => {
      setAdminSession(true);
      queryClient.invalidateQueries({ queryKey: ['adminSession'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return () => {
    setAdminSession(false);
    queryClient.clear();
  };
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching && getAdminSession(),
    retry: false,
  });
}

export function useGetApprovedFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['approvedFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedFeedback();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useApproveFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approveFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      toast.success('Feedback approved and is now visible on the website');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve feedback');
    },
  });
}

export function useRejectFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const status = { rejected: null } as unknown as Parameters<typeof actor.updateFeedbackStatus>[1];
      await actor.updateFeedbackStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      toast.success('Feedback rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject feedback');
    },
  });
}

export function useResetFeedbackToPending() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const status = { pending: null } as unknown as Parameters<typeof actor.updateFeedbackStatus>[1];
      await actor.updateFeedbackStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      toast.success('Feedback reset to pending');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset feedback');
    },
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching && getAdminSession(),
    retry: false,
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: 'pending' | 'approved' | 'rejected' }) => {
      if (!actor) throw new Error('Actor not available');
      const backendStatus = { [status]: null } as unknown as Parameters<typeof actor.updateAppointmentStatus>[1];
      await actor.updateAppointmentStatus(id, backendStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
      toast.success('Appointment status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update appointment status');
    },
  });
}

export function useBlockDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.blockDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
      toast.success('Date blocked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to block date');
    },
  });
}

export function useUnblockDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.unblockDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
      toast.success('Date unblocked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unblock date');
    },
  });
}

export function useGetBlockedDates() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['blockedDates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockedDates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, rating, review }: { name: string; rating: bigint; review: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitFeedback(name, rating, review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      toast.success('Feedback submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit feedback');
    },
  });
}

export function useBookAppointment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      message,
      date,
      time,
    }: {
      name: string;
      phone: string;
      email: string;
      message: string;
      date: string;
      time: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.bookAppointment(name, phone, email, message, date, time);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to book appointment');
    },
  });
}
