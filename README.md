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
