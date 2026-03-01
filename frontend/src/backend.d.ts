import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Feedback {
    id: bigint;
    status: FeedbackStatus;
    review: string;
    name: string;
    submittedAt: Time;
    rating: bigint;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    date: string;
    name: string;
    createdAt: Time;
    time: string;
    email: string;
    message: string;
    phone: string;
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
    adminLogin(username: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockDate(date: string): Promise<void>;
    bookAppointment(name: string, phone: string, email: string, message: string, date: string, time: string): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAppointmentsByStatus(status: AppointmentStatus): Promise<Array<Appointment>>;
    getApprovedFeedback(): Promise<Array<Feedback>>;
    getBlockedDates(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeedbackByStatus(status: FeedbackStatus): Promise<Array<Feedback>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitFeedback(name: string, rating: bigint, review: string): Promise<void>;
    unblockDate(date: string): Promise<void>;
    updateAppointmentStatus(id: bigint, status: AppointmentStatus): Promise<void>;
    updateFeedbackStatus(id: bigint, status: FeedbackStatus): Promise<void>;
}
