# Prisma 7 Setup Guide

This project uses **Prisma 7** which requires a different setup than Prisma 5/6.

## Key Changes in Prisma 7

- `schema.prisma` no longer has `url = env("DATABASE_URL")` in the datasource
- A `prisma.config.ts` file at the project root provides the DB connection
- The `PrismaClient` must use a database adapter (`@prisma/adapter-pg` for PostgreSQL)

## Setup Steps

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local` from the example
```bash
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL and other keys
```

### 3. Generate the Prisma Client
```bash
npx prisma generate
```

### 4. Push the schema to your database
```bash
npx prisma db push
```

### 5. Seed demo data
```bash
npm run db:seed
```

## Environment Variables Required

The most important one for Prisma:
```
DATABASE_URL="postgresql://user:password@localhost:5432/navkala_crochet"
```

Get a free PostgreSQL database from:
- [Neon](https://neon.tech) (recommended, free tier)
- [Supabase](https://supabase.com) (free tier)
- [Railway](https://railway.app)
- Local: `postgresql://postgres:password@localhost:5432/navkala_crochet`

## How the Adapter Works

`prisma.config.ts` (project root) reads `DATABASE_URL` at runtime and passes it to the `PrismaPg` adapter. This is the Prisma 7 way of configuring database connections.

`src/lib/prisma.ts` creates the `PrismaClient` with the adapter for all server-side database calls.
