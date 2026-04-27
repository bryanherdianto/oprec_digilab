# Digital Laboratory Open Recruitment (Digilab Oprec)

A modern, responsive web application for managing the recruitment process of Digital Laboratory laboratory assistants (aslab) or members. Built with Next.js 15, Supabase, and Tailwind CSS.

## Tech Stack

### Frontend

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [Motion](https://motion.dev/)
- **Icons:** [Tabler Icons](https://tabler.io/icons) & [Lucide React](https://lucide.dev/)
- **Components:** Radix UI primitives and custom UI components (Aceternity-style)

### Backend & Database

- **Auth & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Server Actions:** Next.js built-in server-side logic
- **Middleware:** Next.js Middleware for route protection

## Features

- **User Authentication:** Secure login and signup powered by Supabase Auth with Google integration.
- **Dynamic Registration:** Multi-step registration form for personal information, file uploads, and essay submissions.
- **Responsive Dashboard:** Interactive sidebar and layout for managing recruitment data.
- **Modern UI/UX:** Features like glassmorphism, card-hover effects, timelines, and smooth transitions.
- **File Management:** Integration for uploading and managing recruitment documents.

## Project Structure

```text
app/            # Next.js App Router (pages and layouts)
backend/        # Supabase client, services, and shared logic
components/     # UI components (sidebar, forms, sections)
lib/            # Utility functions and shared helpers
public/         # Static assets (images, icons)
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd oprec-digilab
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

### Push Database Schema

Migrations include tables, RLS policies, and storage buckets. Run the following commands:

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
npx supabase db push
```

### Configure Google OAuth Provider

This must be done manually in the Supabase Dashboard (not included in migrations or config.toml).

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Set the application type to **Web application**
6. Add the following **Authorized redirect URI**:
   ```
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**
8. In your Supabase Dashboard, go to **Authentication → Providers → Google**, enable it, and paste the Client ID and Client Secret

### Configure Email Templates

Email templates in `config.toml` and `supabase/templates/` only apply to **local development**. For the hosted project, configure them manually:

1. Go to **Supabase Dashboard → Authentication → Email Templates**
2. Select **Confirm signup** and paste your custom HTML
3. The custom template is available in `supabase/templates/confirm_signup.html`

### Local Development with Supabase (Only for Local Development)

For local development with a full Supabase stack:

```bash
npx supabase start
```

This spins up local Supabase using `config.toml` + migrations. To reset the local database (re-applies migrations + runs `seed.sql`):

```bash
npx supabase db reset
```

## Deploying to Vercel

1. Push your repository to GitHub
2. Go to [Vercel](https://vercel.com/) and import the project
3. Add the following environment variables in **Project Settings → Environment Variables**:

   | Variable                        | Description                                        |
   | ------------------------------- | -------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                          |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key                        |
   | `NEXT_PUBLIC_DEADLINE`          | Registration deadline (e.g. `2026-05-09T23:59:59`) |

4. Deploy

## DNS Configuration (Cloudflare)

1. In your Vercel project, go to **Settings → Domains** and add your custom domain
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/), select your domain
3. Add a DNS record:

   | Type  | Name                          | Value                  | Proxy status                      |
   | ----- | ----------------------------- | ---------------------- | --------------------------------- |
   | CNAME | `@` or subdomain (e.g. `www`) | `cname.vercel-dns.com` | DNS only (grey cloud) recommended |

4. If using Cloudflare proxy (orange cloud), disable it during Vercel SSL provisioning, then re-enable after the SSL certificate is issued
5. Wait for Vercel to provision the SSL certificate (usually a few minutes)
