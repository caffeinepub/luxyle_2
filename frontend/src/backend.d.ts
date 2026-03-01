import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Feedback {
    id: bigint;
    status: FeedbackStatus;
    review: string;
    name: string;
    createdAt: bigint;
    rating: bigint;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    date: string;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    phone: string;
    timeSlot: string;
}
export interface UserProfile {
    name: string;
}
export enum AppointmentStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Admin-only: add a date to the blocked list.
     */
    addBlockedDate(date: string): Promise<void>;
    /**
     * / Admin-only: approve an appointment.
     */
    approveAppointment(id: bigint): Promise<void>;
    /**
     * / Admin-only: approve a feedback entry.
     */
    approveFeedback(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Admin-only: view all appointments.
     */
    getAllAppointments(): Promise<Array<Appointment>>;
    /**
     * / Admin-only: view all feedback regardless of status.
     */
    getAllFeedback(): Promise<Array<Feedback>>;
    /**
     * / Public: only approved feedback is returned.
     */
    getApprovedFeedback(): Promise<Array<Feedback>>;
    /**
     * / Public: get the list of blocked dates so the frontend can disable them.
     */
    getBlockedDates(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Admin-only: view all pending feedback.
     */
    getPendingFeedback(): Promise<Array<Feedback>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Admin-only: reject an appointment.
     */
    rejectAppointment(id: bigint): Promise<void>;
    /**
     * / Admin-only: reject a feedback entry.
     */
    rejectFeedback(id: bigint): Promise<void>;
    /**
     * / Admin-only: remove a date from the blocked list.
     */
    removeBlockedDate(date: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Anyone (including guests) can book an appointment.
     */
    submitAppointment(date: string, timeSlot: string, name: string, phone: string, email: string, message: string): Promise<bigint>;
    /**
     * / Anyone (including guests) can submit feedback.
     */
    submitFeedback(name: string, rating: bigint, review: string): Promise<bigint>;
}
