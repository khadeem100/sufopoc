# Quick Setup Guide

## Step 1: Create .env file

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_5ca1BlhwUjnW@ep-calm-smoke-ahaw6ypf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Set up database

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Start the development server

```bash
npm run dev
```

The app will be available at http://localhost:3000

