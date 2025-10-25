# Here's the Jump!

This is the codebase for "Here's the Jump!", a Next.js application that serves as the ultimate database of movie jumpscares. It allows users to watch horror movies with confidence by knowing when the scares are coming, or to avoid them entirely.

The project includes a full-featured website, a data-rich API, and a backend designed for a companion browser extension.

## Core Features

*   **Jumpscare Database**: Detailed information on movies, including a categorized and timestamped list of every jumpscare.
*   **Advanced Search**: Robust movie search powered by PostgreSQL, featuring partial matching, typo tolerance, and full-text search capabilities.
*   **Discover Page**: Curated lists of movies, such as "Recently Added," "Highest Rated," and "Most Jumpscares."
*   **SRT Export**: Users can download jumpscare data as an SRT subtitle file to use with their media player.
*   **Browser Extension Support**: A dedicated API endpoint to provide jumpscare data for a companion browser extension.
*   **Rate Limiting**: API endpoints are protected against abuse with IP-based rate limiting.
*   **Terms of Service**: A clear and detailed terms of service page outlining data usage and restrictions.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Database**: [Supabase](https://supabase.com/) / [PostgreSQL](https://www.postgresql.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for components.
*   **Deployment**: [Vercel](https://vercel.com/)
*   **Analytics**: Vercel Analytics & Speed Insights
*   **Language**: TypeScript

## Project Structure

The project follows a standard Next.js App Router structure.

```
/
├── docs/
│   └── database-setup.md   # SQL scripts for setting up the database
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # API endpoints
│   │   ├── movie/          # Dynamic movie detail pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── ui/             # UI components from shadcn/ui
│   ├── lib/                # Utility functions and server-side logic
│   └── data/               # Mock data for development
├── .env.local.example      # Example environment variables
└── next.config.mjs         # Next.js configuration
```

## Getting Started

### 1. Environment Variables

Create a `.env.local` file in the root of the project and add the necessary Supabase credentials. You can use `.env.local.example` as a template.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Database Setup

This project requires a specific PostgreSQL database schema and configuration. The complete setup scripts, including required extensions (`pg_trgm`), performance indexes, and custom RPC functions, are located in [`docs/database-setup.md`](docs/database-setup.md).

Run the SQL commands in that file against your Supabase instance to prepare the database.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application exposes several API endpoints under `/api`:

*   `GET /api/discover`: Fetches curated movie lists for the homepage.
*   `GET /api/search?q={query}`: Performs a search for movies based on the query parameter.
*   `GET /api/movie/[id]/export`: Generates and returns an SRT subtitle file for a given movie ID.
*   `GET /api/extension/jumpscares`: A dedicated endpoint for the browser extension to fetch movie and jumpscare data by title and year. It includes installation tracking and rate limiting.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Ensure you have set up the required environment variables in your Vercel project settings.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
