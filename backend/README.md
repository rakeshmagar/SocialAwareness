# SocialConnect Backend API

Node.js + Express REST API with MySQL and Sequelize.

## What is implemented

- User and small-business registration
- Secure password hashing (Node.js `scrypt`)
- JWT login/authentication
- Role-based access (`user`, `business`, `admin`)
- Campaign creation, admin approval/rejection, public listing and duplicate-safe joining
- Community issue reporting, admin resolve/dismiss workflow
- Business lead/RFP publishing and duplicate-safe responses
- Sequelize model relationships and MySQL persistence
- Central 404/error handling and input validation

## Setup

1. Create a MySQL database:
   `CREATE DATABASE social_awareness_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. Copy `.env.example` to `.env` and enter your MySQL password and a strong JWT secret.
3. Run `npm install` inside `backend`.
4. Run `npm run dev` or `npm start`.
5. API health check: `GET http://localhost:5000/api/health`.

The API uses `sequelize.sync()` without `alter` so it does not repeatedly attempt destructive table alterations.

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `POST /api/campaigns/:id/join`
- `GET /api/campaigns/pending` (admin)
- `PATCH /api/campaigns/:id/review` (admin)
- `GET /api/reports`
- `POST /api/reports`
- `PATCH /api/reports/:id/resolve` (admin)
- `PATCH /api/reports/:id/dismiss` (admin)
- `GET /api/leads`
- `POST /api/leads` (business/admin)
- `POST /api/leads/:id/respond`

Authenticated routes require `Authorization: Bearer <token>`.
