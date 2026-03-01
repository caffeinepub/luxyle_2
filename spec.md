# Specification

## Summary
**Goal:** Fix admin access so that the admin dashboard can correctly retrieve and display all appointment requests and feedback submissions.

**Planned changes:**
- Fix backend access control so the appointment listing function correctly identifies admin callers and returns all appointments, including pending ones
- Fix backend access control so the feedback listing function correctly identifies admin callers and returns all feedback entries, including unapproved ones
- Fix the Appointments tab in the admin dashboard frontend to correctly pass admin credentials when fetching appointments and handle loading, empty, and error states
- Fix the Feedback tab in the admin dashboard frontend to correctly pass admin credentials when fetching feedback and handle loading, empty, and error states

**User-visible outcome:** After logging in as admin, the Appointments and Feedback tabs in the admin dashboard display all submitted records without blank screens or authorization errors.
