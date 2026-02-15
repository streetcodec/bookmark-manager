# Bookmark Manager

A modern, real-time bookmark manager built with Next.js 15, Supabase, and Google OAuth authentication.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google (no email/password)
- 📚 **Bookmark Management** - Add, view, and delete bookmarks with URL and title
- 🔒 **Private & Secure** - Each user's bookmarks are completely private
- ⚡ **Real-time Sync** - Bookmarks update instantly across all open tabs
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🚀 **Built with Next.js 15** - App Router, Server Components, and TypeScript

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Real-time**: Supabase Realtime

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud account for OAuth credentials

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API** and copy:
   - Project URL
   - Anon/Public key
3. Go to **SQL Editor** and run the schema from `supabase-schema.sql`
4. Go to **Authentication > Providers**
5. Enable Google provider
6. Configure Google OAuth (see next section)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**
8. Add them to your Supabase Google provider settings

### 4. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Initialize Database

The app will automatically detect if the database tables are missing and provide helpful error messages. You have several options:

**Option A: Manual Setup (Recommended)**
1. Go to your Supabase Dashboard → SQL Editor
2. Run the contents of `supabase-schema.sql`

**Option B: Check Status**
```bash
npm run dev  # Start the server first
npm run db:check  # Check if database is initialized
```

See [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md) for detailed instructions.

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Database Schema

The application uses a single `bookmarks` table with Row Level Security (RLS) policies:

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE
);
```

**RLS Policies:**
- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only delete their own bookmarks

## Project Structure

```
bookmark-manager/
├── app/
│   ├── api/
│   │   └── bookmarks/          # API routes for CRUD operations
│   ├── auth/
│   │   └── callback/           # OAuth callback handler
│   ├── dashboard/              # Protected dashboard page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── AuthButton.tsx          # Google sign-in/out button
│   ├── BookmarkForm.tsx        # Add bookmark form
│   └── BookmarkList.tsx        # Real-time bookmark list
├── lib/
│   └── supabase/               # Supabase client configurations
├── types/
│   └── bookmark.ts             # TypeScript types
└── middleware.ts               # Auth middleware
```

## How It Works

### Authentication
- Users sign in exclusively with Google OAuth
- Supabase handles the OAuth flow and session management
- Middleware protects routes and refreshes sessions automatically

### Real-time Updates
- Uses Supabase Realtime to subscribe to database changes
- When a bookmark is added/deleted in one tab, all other tabs update instantly
- No manual refresh needed

### Privacy & Security
- Row Level Security (RLS) ensures users can only access their own data
- All queries are automatically filtered by user ID
- Server-side authentication checks on all API routes

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

This app can be deployed to Vercel, Netlify, or any platform that supports Next.js:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in the deployment settings
4. Update the OAuth redirect URLs to include your production domain
5. Deploy!

## License

MIT
