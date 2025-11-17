# Vercel Deployment Guide

This guide will help you deploy your CRM to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - Use Neon, Supabase, or Vercel Postgres
4. **GitHub OAuth App** - For authentication

## Step-by-Step Deployment

### 1. Prepare Your Database

Set up a PostgreSQL database:
- **Neon** (Recommended): [neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [supabase.com](https://supabase.com) - Free tier available
- **Vercel Postgres**: Available in Vercel dashboard

After creating your database, get the connection string (DATABASE_URL).

### 2. Run Database Migrations Locally (Optional)

Before deploying, you can push your schema:
```bash
npm run db:push
```

Or run migrations after deployment using Vercel's CLI or a migration script.

### 3. Update GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update the **Authorization callback URL** to:
   - For preview deployments: `https://your-project-name.vercel.app/api/auth/callback/github`
   - For production: `https://your-domain.com/api/auth/callback/github`

### 4. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. Click "Deploy" (don't add env vars yet - we'll do that after)

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

### 5. Configure Environment Variables

After the first deployment, go to your project settings in Vercel:

**Project Settings > Environment Variables**

Add these variables:

#### Required Variables:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
BETTER_AUTH_SECRET=your-random-secret-32-characters-minimum
BETTER_AUTH_GITHUB_CLIENT_ID=your_github_client_id
BETTER_AUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Optional Variables (for custom domain):

```
NEXT_PUBLIC_APP_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com
```

**Important:**
- Set these for **Production**, **Preview**, and **Development** environments
- After adding variables, **redeploy** your project

### 6. Generate BETTER_AUTH_SECRET

Generate a secure random string:
- Online: https://generate-secret.vercel.app/32
- CLI: `openssl rand -base64 32`
- Node: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### 7. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

### 8. Verify Deployment

1. Visit your Vercel deployment URL
2. Try signing in with GitHub
3. Create a test contact
4. Verify everything works

## Post-Deployment Checklist

- [ ] Database migrations applied (if needed)
- [ ] GitHub OAuth callback URL updated
- [ ] Environment variables set in Vercel
- [ ] Test sign-in functionality
- [ ] Test contact creation
- [ ] Test contact editing
- [ ] Verify database connection

## Custom Domain Setup

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update environment variables:
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
   - `BETTER_AUTH_URL=https://your-domain.com`
4. Update GitHub OAuth callback URL to match
5. Redeploy

## Troubleshooting

### Build Fails

- Check that all required environment variables are set
- Verify `DATABASE_URL` is correct
- Check build logs in Vercel dashboard

### Authentication Not Working

- Verify `BETTER_AUTH_SECRET` is set (required in production)
- Check GitHub OAuth callback URL matches your domain
- Verify `BETTER_AUTH_GITHUB_CLIENT_ID` and `BETTER_AUTH_GITHUB_CLIENT_SECRET` are correct

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled (`?sslmode=require`)

### Environment Variables Not Working

- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

## Database Migrations on Vercel

You can run migrations using Vercel CLI:

```bash
vercel env pull .env.local
npm run db:push
```

Or set up a migration script in your build process if needed.

## Support

For issues:
- Check Vercel deployment logs
- Check browser console for errors
- Verify all environment variables are set correctly

