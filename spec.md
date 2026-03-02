# Specification

## Summary
**Goal:** Display appointment requests and feedback requests on the admin dashboard so admins can review and act on them.

**Planned changes:**
- In the Appointments tab of the admin dashboard, fetch and list all appointment requests using existing React Query hooks, showing requester name, date, time slot, and status, with confirm/reject actions per entry and an empty state message when none exist.
- In the Feedback tab of the admin dashboard, fetch and list all feedback entries using existing React Query hooks, showing reviewer name, star rating, review text, and status, with approve/reject actions per entry and an empty state message when none exist.

**User-visible outcome:** Admins can view, confirm, or reject appointment requests and approve or reject feedback entries directly from the admin dashboard tabs.
