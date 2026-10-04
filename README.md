# Phoneme Games

Phoneme Games is a full-stack web application developed for Assessment 3 in Cloud-Based Web Applications.

The application extends the work completed in Assessments 1 and 2. It now includes a data-driven dashboard, persistent usage statistics, observability, automated testing, load testing and accessibility evaluation in addition to the existing database-backed Wordle and Word Search activities.

## Student Details

- Name: Lado Suliman
- Student ID: 22462161
- Subject: Cloud-Based Web Applications

## Features

- Home, About, Wordle, Word Search, Settings, Manage Data and Dashboard pages
- Phoneme-based Wordle activity
- Phoneme-based Word Search activity
- Database-backed word storage
- Multi-character phoneme support
- Create, read, update and delete words
- Create, read, update and delete activity configurations
- Multiple saved activity configurations
- Select specific words for each activity
- Activity settings stored in the database
- Standalone downloadable HTML generation for Wordle
- Standalone downloadable HTML generation for Word Search
- Data-driven reporting dashboard
- Successful and failed generation tracking
- Page-view tracking
- Average time-on-page tracking
- Activity creation tracking
- Recent activity reporting
- Most-used activity type reporting
- API and database health monitoring
- Light and dark themes
- PostgreSQL database
- Prisma ORM
- Backend API
- Docker Compose support
- Playwright end-to-end testing
- JMeter load testing
- Lighthouse accessibility testing

## Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API routes
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Testing and Observability

- Playwright
- Apache JMeter
- Google Lighthouse
- Application usage-event tracking
- Health-check endpoint

### Deployment and Development

- Docker
- Docker Compose
- Git
- GitHub

## Dashboard and Reporting

Assessment 3 introduces a data-driven dashboard that displays application statistics stored and retrieved through the backend.

The dashboard includes:

- Total stored words
- Total Wordle activity configurations
- Total Word Search activity configurations
- Successful generation count
- Failed generation count
- Total generated outputs
- Average time on page
- Recorded page views
- Activity creation count
- Most-used activity type
- Recent activity
- API health status
- Database connection status

## Usage Event Tracking

The application stores usage events in PostgreSQL.

Tracked event types include:

- `ACTIVITY_CREATED`
- `GENERATION_SUCCESS`
- `GENERATION_FAILED`
- `PAGE_VIEW`
- `PAGE_TIME`

These events provide the data used by the reporting dashboard.

## Testing

### Playwright

Playwright is used for end-to-end testing.

The automated tests cover:

- Builder CRUD workflow
- User Wordle HTML generation workflow

Both tests passed successfully in Chromium.

### JMeter

Apache JMeter is used for staged load testing.

The application was tested at increasing concurrent-user levels including:

- 1 user
- 10 users
- 100 users
- 1,000 users
- 2,000 users

The 2,000-user test generated 10,000 HTTP requests with zero errors.

A 10,000 concurrent-user stress test was also attempted, but the local JMeter JVM reached its native thread limit before the full workload could start.

### Lighthouse

Google Lighthouse was used to evaluate accessibility.

The following pages achieved an Accessibility score of 100:

- Home
- Wordle
- Word Search
- Dashboard

## Health Check

The backend provides a health-check endpoint at:

```text
http://localhost:3001/health