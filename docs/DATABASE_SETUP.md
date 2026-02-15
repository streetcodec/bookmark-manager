# Database Initialization

This project includes automatic database table checking and helpful error messages.

## Quick Setup

### Option 1: Manual Setup (Recommended for Production)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `supabase-schema.sql`
6. Click **Run**

### Option 2: Check Database Status via API

Once your dev server is running:

```bash
# Check if database is initialized
npm run db:check

# Or manually:
curl http://localhost:3000/api/db/init
```

### Option 3: Auto-Initialize (Optional)

If you want automatic table creation:

1. Get your service role key:
   - Go to Supabase Dashboard > Settings > API
   - Copy the `service_role` key (⚠️ Keep this secret!)

2. Add to your `.env` file:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

3. Send a POST request:
   ```bash
   curl -X POST http://localhost:3000/api/db/init
   ```

## What Gets Created

The schema creates:
- ✅ `bookmarks` table with UUID primary key
- ✅ Row Level Security (RLS) policies
- ✅ User-specific access controls
- ✅ Performance indexes

## Error Handling

If you see "Could not find the table 'public.bookmarks' in the schema cache":
- The API will now return a helpful error with setup instructions
- Check `/api/db/init` to verify database status
- Follow the manual setup steps above

## Security Note

⚠️ **Never commit your `SUPABASE_SERVICE_ROLE_KEY` to version control!**
- It's already in `.gitignore`
- Only use it for development/initialization
- For production, use migration tools or manual SQL execution
