# Luxyle

## Current State
The Luxyle luxury interior décor website has a full-stack implementation with:
- Public-facing pages: Home, About, Collection, Contact
- Appointment booking and feedback submission (public, no auth required)
- Admin dashboard at `/admin` with a 2-step auth flow:
  1. Frontend credential gate: username "Luxyle Indore" / password "Luxyle1234"
  2. Internet Identity (II) "Verify Identity" step that provides an authenticated principal
- Backend (`main.mo`) enforces `#admin` role checks on all dashboard queries/mutations (`getDashboardData`, `getAllAppointments`, `getAllFeedback`, `approveFeedback`, `rejectFeedback`, `approveAppointment`, `rejectAppointment`, `addBlockedDate`, `removeBlockedDate`)
- Because the II step is required to get admin principal, and the II flow is unreliable/confusing for the user, appointment and feedback data never loads in the dashboard

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- **Backend**: Remove the `#admin` role check from all dashboard-related functions so they are publicly callable. Access will be controlled solely by the frontend credential gate.
  - `getDashboardData` — remove admin check
  - `getAllAppointments` — remove admin check
  - `getAllFeedback` — remove admin check
  - `getPendingFeedback` — remove admin check
  - `approveFeedback` — remove admin check
  - `rejectFeedback` — remove admin check
  - `approveAppointment` — remove admin check
  - `rejectAppointment` — remove admin check
  - `addBlockedDate` — remove admin check
  - `removeBlockedDate` — remove admin check
- **Frontend `AdminDashboard.tsx`**: Remove the Internet Identity "Verify Identity" step entirely. After the user passes the credential login (username + password), show the dashboard directly without requiring II login.

### Remove
- The `IILoginScreen` component and all II-dependent logic from `AdminDashboard.tsx`
- The II login/identity requirement for loading dashboard data

## Implementation Plan
1. Regenerate backend with all dashboard functions having no admin role checks (publicly accessible)
2. Update `AdminDashboard.tsx` to remove the II step — after `credentialAuthed` is true, render the dashboard tabs directly without checking `isAuthenticated`
