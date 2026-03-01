# Specification

## Summary
**Goal:** Add admin username/password authentication so that an admin can approve or reject submitted feedback, and display only approved feedback on the homepage's reviews section.

**Planned changes:**
- Backend: Store admin credentials and validate them in an `adminLogin` function that returns an admin token/session; add `approveFeedback` and `rejectFeedback` functions restricted to authenticated admins; persist approval status on feedback records across upgrades.
- Frontend (AdminDashboard): Show an `AdminLoginForm` at `/admin` when unauthenticated; after login, display all submitted feedback with Approve/Reject buttons, inline loading spinners, and success/error toasts.
- Frontend (ReviewsSection): Fetch only approved feedback from the backend and display it alongside existing seed reviews; hide pending and rejected items; show loading skeletons while fetching.

**User-visible outcome:** An admin can log in with a username and password at `/admin`, approve or reject feedback submissions, and approved feedback automatically appears in the reviews section on the homepage.
