# Job Platform - Full-Stack Web Application

A modern, production-ready job platform built with Next.js 14, React, TypeScript, Prisma, PostgreSQL, and TailwindCSS.

## Features

### User Types
- **Student**: Browse and apply to jobs and trainings
- **Expert**: Enhanced profile with expertise and portfolio
- **Ambassador**: Create job postings and opleidingen (requires verification)
- **Admin**: Full platform management and analytics

### Key Features
- ✅ Modern landing page with job/opleidingen browsing
- ✅ Authentication with NextAuth (email/password)
- ✅ Multi-step onboarding flows for each user type
- ✅ Role-based dashboards
- ✅ Job and Opleidingen CRUD operations
- ✅ Application system with status tracking
- ✅ Role-based access control
- ✅ Search and filtering
- ✅ Clean, minimalistic UI (white, grey, black theme)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **Backend**: Next.js Server Actions, Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobplatform?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── onboarding/        # Onboarding flows
│   ├── student/           # Student dashboard
│   ├── expert/            # Expert dashboard
│   ├── ambassador/        # Ambassador dashboard
│   ├── admin/             # Admin dashboard
│   ├── jobs/              # Job browsing pages
│   └── opleidingen/       # Opleidingen browsing pages
├── components/            # React components
│   └── ui/               # ShadCN UI components
├── lib/                   # Utility functions
├── prisma/               # Prisma schema
└── types/                # TypeScript types
```

## Database Schema

The application uses Prisma with PostgreSQL. Key models:
- **User**: Users with role-based access (STUDENT, EXPERT, AMBASSADOR, ADMIN)
- **Job**: Job postings created by Admins and Ambassadors
- **Opleiding**: Training/course postings
- **Application**: Applications to jobs or opleidingen with status tracking

## Role-Based Access Control

- **Students/Experts**: Can browse and apply to jobs/opleidingen
- **Ambassadors**: Can create jobs/opleidingen (after admin verification)
- **Admins**: Full access to all features, can verify ambassadors

## Development

### Database Commands
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client
```

### Build for Production
```bash
npm run build
npm start
```

## License

MIT

