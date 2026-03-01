import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Feedback, Appointment } from '../backend';

// ── Admin ──────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ── Feedback ───────────────────────────────────────────────────────────────

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
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetPendingFeedback() {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ['pendingFeedback'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingFeedback();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, rating, review }: { name: string; rating: number; review: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(name, BigInt(rating), review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFeedback'] });
    },
  });
}

export function useApproveFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFeedback'] });
    },
  });
}

export function useRejectFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFeedback'] });
    },
  });
}

// ── Appointments ───────────────────────────────────────────────────────────

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

export function useSubmitAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      date: string;
      timeSlot: string;
      name: string;
      phone: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAppointment(
        data.date,
        data.timeSlot,
        data.name,
        data.phone,
        data.email,
        data.message
      );
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
      if (!actor) throw new Error('Actor not available');
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useApproveAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

export function useRejectAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
    },
  });
}

export function useAddBlockedDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlockedDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
}

export function useRemoveBlockedDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeBlockedDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
}
