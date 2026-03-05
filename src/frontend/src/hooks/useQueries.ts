import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Appointment, DashboardData, Feedback } from "../backend";
import { useActor } from "./useActor";

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function useGetDashboardData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getDashboardData();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export function useGetApprovedFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ["approvedFeedback"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedFeedback();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ["allFeedback"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllFeedback();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}

export function useGetPendingFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ["pendingFeedback"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getPendingFeedback();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
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
      if (!actor) throw new Error("Actor not available");
      return actor.submitFeedback(name, rating, review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["pendingFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["allFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });
}

export function useApproveFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["approvedFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["allFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["pendingFeedback"] });
    },
  });
}

export function useRejectFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["approvedFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["allFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["pendingFeedback"] });
    },
  });
}

// ── Appointments ──────────────────────────────────────────────────────────────

export function useGetAllAppointments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllAppointments();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}

export function useSubmitAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      timeSlot,
      name,
      phone,
      email,
      message,
    }: {
      date: string;
      timeSlot: string;
      name: string;
      phone: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAppointment(
        date,
        timeSlot,
        name,
        phone,
        email,
        message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });
}

export function useApproveAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
    },
  });
}

export function useRejectAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
    },
  });
}

// ── Blocked Dates ─────────────────────────────────────────────────────────────

export function useGetBlockedDates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["blockedDates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockedDates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddBlockedDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addBlockedDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedDates"] });
    },
  });
}

export function useRemoveBlockedDate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeBlockedDate(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedDates"] });
    },
  });
}
