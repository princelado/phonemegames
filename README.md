# Phoneme Games

Phoneme Games is a full-stack web application developed for Assessment 2 in Cloud-Based Web Applications.

The application supports phoneme-based classroom activities and extends the original frontend from Assessment 1 with a backend API, PostgreSQL database, Prisma ORM, Docker containers and database-backed activity generation.

## Student Details

- Name: Lado Suliman
- Student ID: 22462161
- Subject: Cloud-Based Web Applications

## Features

- Home, About, Wordle, Word Search, Settings and Manage Data pages
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
- Light and dark themes
- PostgreSQL database
- Prisma ORM
- Backend API
- Health check endpoint
- Docker Compose support

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

### Deployment and Development

- Docker
- Docker Compose
- Git
- GitHub

## Project Structure

```text
cse3cwa_a2_Lado_Suliman_s22462161/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── Dockerfile
│   └── package.json
│
├── api/
│   ├── app/
│   │   ├── api/
│   │   └── health/
│   ├── lib/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.mjs
│   │   └── migrations/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md