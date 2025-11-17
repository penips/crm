# CRM - Contact Management System

A contact-focused CRM built with the T3 Stack (Next.js, tRPC, Drizzle ORM, Better Auth, Tailwind CSS).

## Features

- 🔐 Authentication with Better Auth (GitHub OAuth + Email/Password)
- 👥 Contact Management (Create, Read, Update, Delete)
- 🔍 Search and filter contacts
- 🏷️ Tag system for organizing contacts
- 📱 Responsive design
- ⚡ Fast and type-safe with tRPC

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** PostgreSQL (via Drizzle ORM)
- **Authentication:** Better Auth
- **API:** tRPC
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon, Supabase, etc.)
- GitHub OAuth App (for GitHub sign-in)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

   # Better Auth
   BETTER_AUTH_SECRET=your-random-secret-at-least-32-characters-long
   BETTER_AUTH_GITHUB_CLIENT_ID=your_github_client_id
   BETTER_AUTH_GITHUB_CLIENT_SECRET=your_github_client_secret

   # Optional: For production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   BETTER_AUTH_URL=https://your-domain.com
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Prerequisites

1. A Vercel account
2. A PostgreSQL database (Neon, Supabase, or Vercel Postgres)
3. A GitHub OAuth App configured for your production domain

### Steps

1. **Push your code to GitHub**

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   In Vercel project settings, add these environment variables:
   
   **Required:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Generate a secure random string (32+ characters)
   - `BETTER_AUTH_GITHUB_CLIENT_ID` - Your GitHub OAuth Client ID
   - `BETTER_AUTH_GITHUB_CLIENT_SECRET` - Your GitHub OAuth Client Secret
   
   **Optional (for custom domain):**
   - `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://your-domain.com`)
   - `BETTER_AUTH_URL` - Same as NEXT_PUBLIC_APP_URL

4. **Update GitHub OAuth App:**
   - Go to your GitHub OAuth App settings
   - Update "Authorization callback URL" to: `https://your-vercel-domain.vercel.app/api/auth/callback/github`
   - If using a custom domain: `https://your-domain.com/api/auth/callback/github`

5. **Deploy:**
   - Vercel will automatically deploy on push to main branch
   - Or click "Deploy" in the Vercel dashboard

6. **Run database migrations:**
   After first deployment, you may need to run:
   ```bash
   npm run db:push
   ```
   Or set up a migration script in Vercel's build command if needed.

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Secret key for session encryption (32+ chars) |
| `BETTER_AUTH_GITHUB_CLIENT_ID` | Yes | GitHub OAuth Client ID |
| `BETTER_AUTH_GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth Client Secret |
| `NEXT_PUBLIC_APP_URL` | No | Production URL (auto-detected on Vercel) |
| `BETTER_AUTH_URL` | No | Same as NEXT_PUBLIC_APP_URL |

### Database Setup

For production, use a managed PostgreSQL service:

- **Neon** (Recommended): [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Vercel Postgres**: Available in Vercel dashboard

After creating your database, run migrations:
```bash
npm run db:push
```

## Development

```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format:write

# Database commands
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── _components/        # Reusable components
│   ├── contacts/           # Contacts pages
│   └── api/                # API routes
├── server/
│   ├── api/                # tRPC routers
│   ├── better-auth/        # Auth configuration
│   └── db/                 # Database schema
└── trpc/                   # tRPC client setup
```

## License

MIT
