# Phoneme Games API

Separate Next.js API service for CSE3CWA Assessment 3: Data-driven Application and Reporting.

The API uses Prisma ORM with PostgreSQL and provides backend services for the Phoneme Games application.

## Features

- CRUD API routes for words and activity configurations
- PostgreSQL database persistence
- Prisma ORM
- Ordered phoneme storage with support for multi-character phonemes
- Wordle and Word Search activity configurations
- Usage-event tracking
- Successful and failed generation tracking
- Page view and page-time tracking
- Activity creation tracking
- Dashboard reporting statistics
- Recent activity reporting
- API and database health monitoring
- `/health` endpoint

## Assessment 3 Observability

Assessment 3 extends the API with persistent usage events that support the application dashboard.

Tracked events include:

- `ACTIVITY_CREATED`
- `GENERATION_SUCCESS`
- `GENERATION_FAILED`
- `PAGE_VIEW`
- `PAGE_TIME`

These records are stored in PostgreSQL and used to calculate dashboard statistics such as generation counts, average time on page, page views, recent activity and most-used activity type.

## Health Check

The API exposes:

```text
http://localhost:3001/health