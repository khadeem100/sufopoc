# Database Migration Instructions

## Adding `isExpired` Column

The schema has been updated to include an `isExpired` field on both `Job` and `Opleiding` models. You need to run a migration to add this column to your database.

### Option 1: Using Prisma Migrate (Recommended for Production)

```bash
# Create a new migration
npx prisma migrate dev --name add_is_expired

# Apply migrations
npx prisma migrate deploy
```

### Option 2: Using Prisma DB Push (Quick for Development)

```bash
npx prisma db push
```

### Option 3: Manual SQL (If needed)

Run this SQL directly on your database:

```sql
-- Add isExpired column to jobs table
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "isExpired" BOOLEAN NOT NULL DEFAULT false;

-- Add isExpired column to opleidingen table
ALTER TABLE "opleidingen" ADD COLUMN IF NOT EXISTS "isExpired" BOOLEAN NOT NULL DEFAULT false;
```

### For Vercel Deployment

1. **Before deploying**, run the migration locally or on your database:
   ```bash
   npx prisma db push
   ```

2. **Or** add a migration step to your Vercel build process by updating `package.json`:
   ```json
   {
     "scripts": {
       "build": "prisma generate && prisma migrate deploy && next build"
     }
   }
   ```

3. **Or** use Vercel's Postgres integration and run migrations via Vercel CLI:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

### Verify Migration

After running the migration, verify it worked:

```bash
npx prisma studio
```

Check that both `jobs` and `opleidingen` tables have the `isExpired` column.

