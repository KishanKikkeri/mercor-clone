# Mercor Job Platform Clone

A production-ready, full-stack job listing and application platform built as a clone of [Mercor](https://mercor.com). It features a polished UI for browsing jobs, exploring categories, submitting applications, and a complete backend API backed by PostgreSQL via Supabase.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) (shadcn/ui primitives) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **ORM** | [Prisma 7](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) |
| **CMS** | [Contentstack](https://www.contentstack.com/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## 📂 Project Structure

```
mercor-clone/
├── prisma/
│   ├── schema.prisma          # Database schema (Application model + enums)
│   ├── seed.ts                # Optional database seeder
│   └── migrations/            # Prisma migration history
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── about/             # About page
│   │   ├── jobs/              # Job listings + [slug] detail page
│   │   ├── categories/        # Categories + [slug] detail page
│   │   └── api/
│   │       ├── applications/  # POST, GET, PATCH, DELETE /api/applications
│   │       └── health/        # GET /api/health (DB health check)
│   ├── features/
│   │   └── application/       # Application feature module (Clean Architecture)
│   │       ├── api/           # application.api.ts (API controller layer)
│   │       ├── components/    # ApplicationForm, ApplicationDialog, SuccessDialog
│   │       ├── hooks/         # React Query hooks
│   │       ├── repository/    # application.repository.ts (Prisma queries only)
│   │       ├── schemas/       # Zod validation schemas
│   │       ├── services/      # application.service.ts (business logic only)
│   │       └── types/         # TypeScript types & interfaces
│   ├── components/            # Shared UI components (navbar, footer, cards, etc.)
│   ├── hooks/                 # Shared custom React hooks
│   ├── lib/
│   │   ├── prisma/            # Prisma singleton client (pg driver adapter)
│   │   ├── supabase/          # Supabase server/client helpers
│   │   ├── contentstack.ts    # Contentstack CMS data fetcher
│   │   ├── env.ts             # Validated environment variable config (Zod)
│   │   └── mock-data.ts       # Fallback mock data
│   ├── generated/
│   │   └── prisma/            # Auto-generated Prisma Client (do not edit)
│   └── types/                 # Global TypeScript types
├── .env.example               # Environment variable template
├── prisma.config.ts           # Prisma 7 configuration (dotenv loading)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json
```

---

## 🗄️ Database Schema

The application uses a PostgreSQL database managed by Prisma ORM.

### `Application` Model

| Field | Type | Description |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `jobId` | `String` | Reference to the job (from CMS) |
| `jobTitle` | `String` | Snapshot of the job title at application time |
| `companyName` | `String` | Snapshot of the company name at application time |
| `candidateName` | `String` | Applicant's full name |
| `email` | `String` | Applicant's email address |
| `phone` | `String` | Applicant's phone number |
| `linkedinUrl` | `String?` | Optional LinkedIn profile URL |
| `portfolioUrl` | `String?` | Optional portfolio/website URL |
| `coverLetter` | `String?` | Optional cover letter text |
| `resumeUrl` | `String?` | Optional uploaded resume URL (S3) |
| `status` | `ApplicationStatus` | Application state (default: `APPLIED`) |
| `createdAt` | `DateTime` | Auto-set timestamp on creation |
| `updatedAt` | `DateTime` | Auto-updated timestamp |

### `ApplicationStatus` Enum

`APPLIED` → `REVIEWING` → `SHORTLISTED` → `INTERVIEW` → `OFFERED` → `HIRED` / `REJECTED`

---

## 🌐 API Routes

### `POST /api/applications`
Submit a new job application.

**Request Body:**
```json
{
  "jobId": "string",
  "jobTitle": "string",
  "companyName": "string",
  "candidateName": "string",
  "email": "string",
  "phone": "string",
  "linkedinUrl": "string (optional)",
  "portfolioUrl": "string (optional)",
  "coverLetter": "string (optional)"
}
```

**Response:** `201 Created`

---

### `GET /api/applications`
Retrieve all submitted applications.

**Response:** `200 OK` — Array of Application objects.

---

### `PATCH /api/applications`
Update an application's status.

**Request Body:**
```json
{
  "id": "string",
  "status": "REVIEWING | SHORTLISTED | INTERVIEW | OFFERED | HIRED | REJECTED"
}
```

---

### `DELETE /api/applications`
Delete an application by ID.

**Request Body:**
```json
{ "id": "string" }
```

---

### `GET /api/health`
Database health check. Returns `200 OK` if the database connection is healthy.

---

## 🏛️ Application Architecture

The `application` feature follows a **strict n-tier Clean Architecture** pattern:

```
React Form (UI Layer)
    ↓
application.client.ts (Frontend HTTP Client)
    ↓
POST /api/applications (Next.js Route Handler)
    ↓
ApplicationApi (API / Controller Layer)
    ↓
ApplicationService (Business Logic Layer)
    ↓
ApplicationRepository (Data Access Layer)
    ↓
Prisma ORM → Supabase PostgreSQL
```

Each layer has a **single responsibility** and only communicates with the layer directly below it.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/DhanushG78/mercor-clone.git
cd mercor-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and update all required values (see **Environment Variables** section below).

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

### 5. Run Migrations

```bash
npx dotenv -e .env.local -- prisma migrate deploy
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in the following:

### Contentstack CMS

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CS_API_KEY` | Your Contentstack Stack API Key |
| `NEXT_PUBLIC_CS_DELIVERY_TOKEN` | Your Contentstack Delivery Token |
| `NEXT_PUBLIC_CS_ENV` | Environment name (e.g. `production`) |

### Database (Supabase / PostgreSQL)

| Variable | Description | Where to find |
|---|---|---|
| `DATABASE_URL` | Transaction connection string (port 6543) | Supabase → Project Settings → Database → Transaction pooler |
| `DIRECT_URL` | Direct connection string (port 5432) | Supabase → Project Settings → Database → Direct connection |

### Supabase

| Variable | Description | Where to find |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project base URL | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase → Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Supabase → Project Settings → API → service_role key |

### AWS S3 (for resume uploads — future feature)

| Variable | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key ID |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key |
| `AWS_REGION` | S3 bucket region (e.g. `us-east-1`) |
| `AWS_BUCKET_NAME` | Name of the S3 bucket |
| `AWS_BUCKET_URL` | Public base URL of the S3 bucket |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code using Prettier |

---

## 🚢 Deployment

This project is deployment-ready for platforms like **Vercel**, **Contentstack Launch**, or any Node.js hosting environment.

### Required Steps Before Deploying

1. **Set all environment variables** in your hosting platform's environment settings panel (they are **not** pushed to GitHub via `.env.local`).
2. **Run database migrations** against your production Supabase database:
   ```bash
   npx prisma migrate deploy
   ```
3. The `build` command (`prisma generate && next build`) automatically generates the Prisma client on the build machine — no manual step needed.

> **Note:** The `NEXT_PUBLIC_SUPABASE_URL` must be the base project URL only — e.g. `https://your-project.supabase.co` — without any path suffix like `/rest/v1/`.

---

## 🗺️ Pages

| Route | Type | Description |
|---|---|---|
| `/` | Static | Home page with hero, features, and job highlights |
| `/jobs` | Static | Paginated job listings |
| `/jobs/[slug]` | Dynamic | Individual job detail with Apply button |
| `/categories` | Static | Browse jobs by category |
| `/categories/[slug]` | Dynamic | Jobs filtered by category |
| `/about` | Static | About the platform |

---

## 🔮 Roadmap

- [ ] Resume file upload (AWS S3)
- [ ] Candidate authentication (Supabase Auth)
- [ ] Recruiter dashboard
- [ ] Application status email notifications
- [ ] AI-powered resume parsing
- [ ] Admin panel for managing listings

---

## 📄 License

This project is for educational and internship purposes only.
