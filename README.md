# Journal Management System

Production-focused full-stack journal portal with:

- Public frontend for manuscript submissions
- Private admin dashboard for journal and logo management
- Express + MongoDB API with security middleware, rate limiting, and in-memory caching
- Cloudinary file handling for manuscripts and images

## Project Structure

- client: React + Vite frontend
- server: Express + MongoDB backend

## Backend Routing

- GET /health
- POST /api/auth/setup-admin
- POST /api/auth/login
- GET /api/auth/me
- GET /api/journals
- GET /api/journals/:slug
- POST /api/journals (admin)
- PUT /api/journals/:id (admin)
- DELETE /api/journals/:id (admin)
- GET /api/logos
- POST /api/logos (admin)
- DELETE /api/logos/:id (admin)
- POST /api/submissions
- GET /api/submissions (admin)
- PATCH /api/submissions/:id/status (admin)
- DELETE /api/submissions/:id (admin)

### Content CRUD Routes

- GET /api/content/articles
- GET /api/content/articles/:id
- POST /api/content/articles (admin)
- PUT /api/content/articles/:id (admin)
- DELETE /api/content/articles/:id (admin)
- GET /api/content/board-members
- GET /api/content/board-members/:id
- POST /api/content/board-members (admin)
- PUT /api/content/board-members/:id (admin)
- DELETE /api/content/board-members/:id (admin)
- GET /api/content/current-issues
- GET /api/content/current-issues/:id
- POST /api/content/current-issues (admin)
- PUT /api/content/current-issues/:id (admin)
- DELETE /api/content/current-issues/:id (admin)
- GET /api/content/archive-volumes
- GET /api/content/archive-volumes/:id
- POST /api/content/archive-volumes (admin)
- PUT /api/content/archive-volumes/:id (admin)
- DELETE /api/content/archive-volumes/:id (admin)
- GET /api/content/videos
- GET /api/content/videos/:id
- POST /api/content/videos (admin)
- PUT /api/content/videos/:id (admin)
- DELETE /api/content/videos/:id (admin)
- GET /api/content/ppts
- GET /api/content/ppts/:id
- POST /api/content/ppts (admin)
- PUT /api/content/ppts/:id (admin)
- DELETE /api/content/ppts/:id (admin)
- GET /api/content/testimonials
- GET /api/content/testimonials/:id
- POST /api/content/testimonials (admin)
- PUT /api/content/testimonials/:id (admin)
- DELETE /api/content/testimonials/:id (admin)
- GET /api/content/indexing-logos
- GET /api/content/indexing-logos/:id
- POST /api/content/indexing-logos (admin)
- PUT /api/content/indexing-logos/:id (admin)
- DELETE /api/content/indexing-logos/:id (admin)

## Security and Production Features

- Helmet for secure HTTP headers
- CORS with controlled origin
- Rate limits:
  - Global limit
  - Auth endpoints
  - Manuscript submission endpoint
- Mongo sanitize and XSS cleaning
- Compression for response payloads
- NodeCache-based caching on public journal reads
- SMTP email notifications for submission lifecycle transitions:
   - received
   - under_review
   - accepted
   - published

## Required Environment Variables

Create and update:

- server/.env
- client/.env

### server/.env

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/journal_management
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Editorial Team <no-reply@yourdomain.com>"

ADMIN_SETUP_KEY=replace_with_secure_setup_key

### client/.env

VITE_API_BASE_URL=http://localhost:5000/api

## Run Locally

1. Install dependencies:

   npm run install:all

2. Start backend (terminal 1):

   npm run dev:server

3. Start frontend (terminal 2):

   npm run dev:client

4. One-time admin bootstrap:

   POST /api/auth/setup-admin with:
   {
   "setupKey": "<ADMIN_SETUP_KEY>",
   "name": "Admin",
   "email": "admin@example.com",
   "password": "strongpassword"
   }
