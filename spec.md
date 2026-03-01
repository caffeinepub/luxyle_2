# Specification

## Summary
**Goal:** Build a full luxury single-page React website for "Luxyle" interior décor store with an admin dashboard for managing feedback and appointments.

**Planned changes:**
- Set up global theme with beige/ivory/white/gold/royal-blue palette, Cormorant Garamond headings, Jost body text, and smooth scroll
- Build sticky header with logo, nav links (Home, Collection, About, Contact), Instagram icon, Book Appointment CTA, and mobile hamburger menu
- Create hero section with full-width banner image, store name, tagline "Elevating Spaces with Timeless Luxury", Book Appointment scroll CTA, and Get Directions button linking to Google Maps
- Add Featured Collections preview below hero showing 4 images with a "View Full Collection" scroll link
- Build About Us section with exact brand story text, gold decorative divider, and about image
- Build Collection gallery section with all 8 external images in a responsive premium grid, hover zoom/gold overlay effects, and lightbox on click
- Display hardcoded Existing Feedback section with three 5-star reviews (Priya S., Rahul M., Neha K.)
- Add customer feedback submission form (Name, Star Rating, Review) that saves to backend with pending status; approved feedback appears dynamically alongside hardcoded reviews
- Implement Appointment Booking form (date picker with blocked dates disabled, time slot, Name, Phone, Email, Message) stored in backend
- Build Contact section with full store address, embedded Google Maps iframe, contact form (Name, Email, Message), Instagram link, and business hours
- Build site footer with logo, quick links, services list, address, Instagram icon, Get Directions button, and copyright "© 2026 Luxyle. All Rights Reserved."
- Implement password-protected Admin Dashboard with Feedback tab (approve/reject pending reviews) and Appointments tab (approve/reject appointments, manage blocked dates)
- Serve hero banner from `/assets/generated/hero-banner.dim_1920x1080.png` and about image from `/assets/generated/luxyle-about.dim_800x600.png`

**User-visible outcome:** Visitors can browse Luxyle's luxury décor collections, read about the brand, submit feedback and book appointments, and view contact details. An admin can log in to approve/reject feedback and appointments and manage blocked booking dates.
