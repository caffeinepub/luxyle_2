import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Feedback, Appointment, AppointmentStatus } from '../backend';

// FeedbackStatus is not exported as an enum from the backend, define locally
export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

// ─── Feedback Queries ────────────────────────────────────────────────────────

export function useGetApprovedFeedback() {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ['approvedFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
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
      // Cast to the backend's expected type via the variant object shape
      const backendStatus = { [status]: null } as unknown as Parameters<typeof actor.updateFeedbackStatus>[1];
      return actor.updateFeedbackStatus(id, backendStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
    },
  });
}

// ─── Appointment Queries ─────────────────────────────────────────────────────

export function useGetBlockedDates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ['blockedDates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockedDates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name, phone, email, message, date, time,
    }: { name: string; phone: string; email: string; message: string; date: string; time: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookAppointment(name, phone, email, message, date, time);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ['allAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
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

// ─── Admin / Auth ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Login (username/password) ─────────────────────────────────────────

const ADMIN_SESSION_KEY = 'adminAuthenticated';

export function useAdminSession() {
  const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  const setAuthenticated = (value: boolean) => {
    if (value) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  };
  return { isAuthenticated, setAuthenticated };
}

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.adminLogin(username, password);
      if (!result) throw new Error('Invalid username or password');
      return result;
    },
  });
}
