# Specification

## Summary
**Goal:** Remove the admin-only restriction from the dashboard so that any user with a non-empty username and password can access the appointments and feedback sections.

**Planned changes:**
- Update the frontend login logic to accept any non-empty username and password without checking for admin credentials or roles
- Remove admin role gating from the dashboard so any logged-in user can view the appointments and feedback tabs
- Remove or bypass backend admin role checks on the endpoints that return appointments and feedback data

**User-visible outcome:** Any user who enters a non-empty username and password can log in and view the appointments and feedback dashboard, without needing special admin credentials.
