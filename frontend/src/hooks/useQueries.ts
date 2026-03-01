import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AppointmentStatus } from '../backend';

// FeedbackStatus is not exported from backend, define locally
export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

// ─── Admin Session ────────────────────────────────────────────────────────────
const ADMIN_SESSION_KEY = 'adminAuthenticated';

export function getAdminSession(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function setAdminSession(value: boolean) {
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const success = await actor.adminLogin(username, password);
      if (!success) throw new Error('Invalid credentials');
      return success;
    },
    onSuccess: () => {
      setAdminSession(true);
      // Invalidate admin queries so they re-fetch with the now-authenticated session
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();
  const isAdmin = getAdminSession();

  return useQuery({
    queryKey: ['allAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllAppointments();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Unauthorized')) {
          throw new Error('Admin access required. Please log in as admin.');
        }
        throw err;
      }
    },
    enabled: !!actor && !isFetching && isAdmin,
    retry: false,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

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
      return actor.bookAppointment(name, phone, email, message, date, time);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: AppointmentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();
  const isAdmin = getAdminSession();

  return useQuery({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllFeedback();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Unauthorized')) {
          throw new Error('Admin access required. Please log in as admin.');
        }
        throw err;
      }
    },
    enabled: !!actor && !isFetching && isAdmin,
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
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      rating,
      review,
    }: {
      name: string;
      rating: bigint;
      review: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(name, rating, review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
    },
  });
}

export function useUpdateFeedbackStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: FeedbackStatus }) => {
      if (!actor) throw new Error('Actor not available');
      // Cast to the backend's expected type
      const backendStatus = { [status]: null } as unknown as Parameters<typeof actor.updateFeedbackStatus>[1];
      return actor.updateFeedbackStatus(id, backendStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
    },
  });
}

// ─── Blocked Dates ────────────────────────────────────────────────────────────
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

export function useBlockDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
}

export function useUnblockDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unblockDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
}
