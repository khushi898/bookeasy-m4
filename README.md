# BookEasy – Clinic Appointment Booking (MERN)

BookEasy is a full-stack appointment booking app for a clinic. Patients can browse services, choose a free time slot and book it. Admins manage services, time slots and all appointments. The same slot can never be booked twice.

Milestone 4 project – Full Stack + AI Engineering, Cohort 10.

## Live links

- **Frontend:** https://bookeasy-m4.vercel.app
- **API health check:** https://bookeasy-m4-api.onrender.com/api/health

> The API runs on Render's free plan. If it hasn't been used for a while, the first request can take around 50 seconds while the server wakes up.

## Test accounts

| Role  | Email             | Password |
|-------|-------------------|----------|
| User  | test@example.com  | 123456   |
| Admin | admin@example.com | 123456   |

## Features

**Users**
- Sign up and log in (JWT authentication, passwords hashed with bcrypt)
- Browse services with search and pagination
- Pick a date and see only the free time slots
- Book an appointment with optional notes
- View "My appointments" and cancel a booking (the slot becomes free again)

**Admins**
- Dashboard with all appointments – filter by status and date, mark as completed or cancel
- Add, edit and delete services
- Add and delete time slots

**Security and reliability**
- Two roles (user / admin), checked on the backend: 401 when not logged in, 403 when not allowed
- No double-booking: an atomic database update plus a unique index – a second booking for the same slot returns 409