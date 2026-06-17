# Internship Chatbot

A full-stack AI-powered interview platform that generates dynamic interview questions, evaluates candidates automatically, and produces PDF reports — built with React, Node.js, and the Groq AI API.

## Features

- **Role-based access** — separate flows for admins and candidates, with protected routing
- **RSA encryption** — credentials are encrypted client-side before transmission
- **JWT authentication** — secure session management with HTTP-only tokens
- **Email OTP (2FA)** — two-factor authentication via Nodemailer on login
- **Rate limiting** — protection against brute-force and abuse
- **AI interview engine** — dynamic question generation and automated candidate evaluation via Groq API
- **PDF report generation** — downloadable candidate reports with full UTF-8/Bosnian character support (PDFKit + DejaVu font)
- **Admin panel** — candidate management, PDF export, and feedback visibility for candidates

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, react-router-dom |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, RSA encryption, Nodemailer |
| AI | Groq API |
| PDF | PDFKit |

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Groq API key
- SMTP email credentials (e.g. Gmail)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/aminaalispahic/<repo-name>.git
cd <repo-name>
```

**2. Set up environment variables**

Create a `.env` file in the `server` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**3. Install dependencies and run the backend**

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

**4. Install dependencies and run the frontend**

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend) by default.

## Project Structure

```
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/   # Candidate and admin views
│   │   ├── routes/  # Protected role-based routing
│   │   └── utils/   # RSA encryption helpers
├── server/          # Node.js + Express backend
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth, rate limiting
│   ├── prisma/      # Schema and migrations
│   └── utils/       # PDF generation, email, AI integration
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + trigger OTP |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/chat/start` | Start interview session |
| GET | `/api/admin/candidates` | List all candidates (admin) |
| GET | `/api/admin/report/:id` | Download PDF report (admin) |

## Security Notes

- Passwords are encrypted with RSA public key on the client before being sent over the network
- JWTs are short-lived and stored securely
- OTP codes expire after a short window
- Rate limiting is applied on auth endpoints
