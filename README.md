# Industrial Solutions Software Portfolio & Admin CMS
> Production-grade personalized portfolio web application and private CMS for an executive **Director of Engineering** building **Industrial Digital Twin Platforms** for asset-intensive operations.

![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-black?style=flat-square&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-SQLite%20%7C%20Postgres-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v3-38B2AC?style=flat-square&logo=tailwind-css)
![Auth.js v5](https://img.shields.io/badge/Auth.js-v5_Beta-purple?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-Unit_Tested-FCC72B?style=flat-square&logo=vitest)

---

## 1. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC CLIENTS                                 │
│  Executive Recruiters / Hiring Managers / Board Members / Peer Engineers    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / Edge CDN
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS 15 (APP ROUTER)                           │
│                                                                             │
│  [PUBLIC ROUTES]                                                            │
│  ├── /                      Executive overview, Plant-to-Cloud Twin Hero,  │
│  │                          Telemetry KPIs, Reference Architecture SVG,    │
│  │                          NDA Anonymized Timeline, Featured STAR Cases   │
│  ├── /work/[slug]           Deep-dive STAR Case Studies with KPI outcome   │
│  │                          cards and system architecture topology         │
│  ├── /resume                Printer-optimized 2-page executive resume      │
│  ├── /sitemap.xml           Dynamic search index (published records only)  │
│  └── /robots.txt            Allows public discovery; disallows /admin/*    │
│                                                                             │
│  [PRIVATE CMS - EDGE PROTECTED: /admin/*]                                   │
│  ├── Middleware             Edge session verification & route redirection  │
│  ├── Login (/admin/login)   Rate-limited credentials auth (bcryptjs)       │
│  ├── Dashboard (/admin)     Completeness score, [ADD: ...] markers audit   │
│  ├── Preview (/admin/preview) Live unpublished draft visualizer            │
│  ├── Snapshots              Full DB state serialization & 1-click rollback │
│  └── Content CRUD           Profile, Experience, Case Studies, Skills,     │
│                             Architecture layers, Solutions, Credentials     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
              [PRISMA ORM DATA LAYER]       [DECOUPLED STORAGE]
              ├── SQLite (local dev.db)     ├── LocalStorageProvider (public/uploads)
              └── Postgres (Neon / Supabase)└── S3 / Blob Compatible Interface
```

### Key Technical Pillars
1. **Public Site (`/`, `/work/[slug]`, `/resume`)**:
   - Zero hardcoded personal details; 100% loaded dynamically from database.
   - Filtered exclusively by `status: "PUBLISHED"` and `visible: true`.
   - **Customer NDA Protection**: Automated client shielding. If `anonymizeCustomer: true`, sensitive operator names (e.g. *Equinor*, *BP*) are replaced with generic industrial profiles (*"Global Deepwater Energy Operator"*).
   - **Interactive Reference Architecture**: Multi-tier SVG showcasing plant telemetry (Sensors & PLCs $\rightarrow$ Edge Gateways $\rightarrow$ Real-Time Twin Sync $\rightarrow$ Simulation & APM Engine $\rightarrow$ Operator 3D Cockpit).
   - **Accessible & Performance-Tuned**: Semantic HTML5, WCAG AA compliant contrast, dark/light mode toggle with system preference fallback, and `prefers-reduced-motion` compliance.

2. **Private Admin CMS (`/admin/*`)**:
   - Protected by NextAuth v5 session cookie verification at the edge via `src/middleware.ts`.
   - In-memory sliding window rate-limiting for login attempts and contact submissions.
   - **Completeness Scorecard**: Automatically evaluates resume bullets, action verbs, case studies, and missing `[ADD: ...]` placeholders.
   - **Publishing & Rollback Workflow**: Creates immutable `SiteSnapshot` versions and triggers Next.js cache revalidation on demand.
   - **AI Resume & STAR Assistant**: Strict anti-hallucination guardrails that never invent metrics or companies, generating bracketed question tags `[ADD: ...]` for absent figures.

---

## 2. Quickstart (Local Development)

### Prerequisites
- Node.js 18.x or 20.x
- npm 9+ or pnpm 8+

### Step-by-Step Setup

```bash
# 1. Clone or navigate to the repository directory
cd ProfileWeb

# 2. Install dependencies
npm install

# 3. Create your environment configuration
cp .env.example .env

# 4. Generate the Prisma database client
npx prisma generate

# 5. Push the schema to create the local SQLite database (dev.db)
npx prisma db push

# 6. Seed the database with the candidate profile & industrial taxonomy
npm run seed

# 7. Start the development server
npm run dev
```

Open your browser:
- **Public Portfolio:** [http://localhost:3000](http://localhost:3000)
- **Executive Resume:** [http://localhost:3000/resume](http://localhost:3000/resume)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 3. Admin Authentication & Password Generation

The application uses standard bcrypt password hashing stored in your environment.

### Default Credentials (from `.env`):
- **Email:** `director@industrial-twin.dev`
- **Password:** `AdminIndustrial2025!`

### Setting Your Own Secure Password:
To generate a custom bcrypt hash for your production password:

```bash
npm run hash-password
```

Follow the CLI prompt or pass the password:
```bash
npx tsx scripts/hash-password.ts "YourSecureProductionPassword#2025"
```

Copy the generated hash (e.g. `$2a$10$...`) into your `.env` file under `ADMIN_PASSWORD_HASH`:
```env
ADMIN_EMAIL="your-email@domain.com"
ADMIN_PASSWORD_HASH="$2a$10$YourGeneratedBcryptHash..."
```

---

## 4. Production Database: Switching to PostgreSQL (Neon / Supabase)

The Prisma schema is designed for full cross-compatibility between SQLite (local zero-setup development) and PostgreSQL (cloud production).

1. In `prisma/schema.prisma`, change the provider:
   ```prisma
   datasource db {
     provider = "postgresql" // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Update your production `.env` with your Postgres connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Push schema and seed the remote database:
   ```bash
   npx prisma db push
   npm run seed
   ```

*Note: All array collections (techStack, bullets, targetRoles) are stored as serialized JSON strings via `parseJson` utilities, ensuring seamless operation across both database engines without requiring Postgres-specific array types.*

---

## 5. Decoupled File Storage (Uploads)

The portfolio implements a decoupled `StorageProvider` interface (`src/lib/storage/index.ts`):

- **Default (`LocalStorageProvider`)**: Saves files to `public/uploads/` with UUID-prefixed filenames. Ideal for local dev, VPS, or single-container deployments.
- **Cloud Swapping (AWS S3 / Vercel Blob / Cloudflare R2)**:
  To switch to AWS S3 or Cloudflare R2, implement the 2 interface methods:
  ```typescript
  export interface StorageProvider {
    upload(file: Buffer, filename: string, mimeType: string): Promise<string>;
    delete(fileUrl: string): Promise<void>;
  }
  ```
  And inject it inside `src/app/api/upload/route.ts`.

---

## 6. Deployment Guide

### Deploying to Vercel
1. Push this repository to GitHub or GitLab.
2. In the Vercel Dashboard, select **Import Project**.
3. Configure the following Environment Variables:
   - `DATABASE_URL`: Your production PostgreSQL URL (e.g., from Neon or Supabase).
   - `AUTH_SECRET`: A 32-character random string (generated via `openssl rand -base64 32`).
   - `ADMIN_EMAIL`: Your administrative login email.
   - `ADMIN_PASSWORD_HASH`: The bcrypt hash generated via `npm run hash-password`.
   - `NEXT_PUBLIC_APP_URL`: Your custom production domain (e.g., `https://amitkrishna.industrial-twin.dev`).
   - `ANTHROPIC_API_KEY`: *(Optional)* Your Anthropic Claude API key for AI bullet/STAR polish.
4. Set Build Command: `prisma generate && next build`.
5. Deploy.

### Custom Domain & DNS
1. Under Vercel Settings $\rightarrow$ Domains, add your domain (e.g. `amitkrishna.dev`).
2. Add CNAME or A records as instructed by Vercel DNS.
3. Update `NEXT_PUBLIC_APP_URL` to match your canonical domain.

---

## 7. Version Snapshots & Disaster Recovery

- **Creating a Snapshot**: In `/admin/snapshots`, click **"Create State Snapshot"**. This serializes the complete, unified relational database state into an immutable JSON document stored in the `SiteSnapshot` table.
- **One-Click Rollback**: If an accidental edit or publish breaks content formatting, click **"Restore This Version"**. The system executes an atomic transaction, replacing the live tables with the snapshot data and immediately invalidating Next.js edge caches via `revalidatePath`.
- **JSON Export / Dry-Run Import**: Navigate to `/admin/settings` to export the full site database as a portable `.json` backup or import previously exported archives with schema validation.

---

## 8. Verification & Testing

### Running Unit Tests (Vitest)
Unit tests verify utility calculations (exact tenure, date formatting), bullet action verb validation, JSON string parsing, and customer NDA anonymization:
```bash
npm test
```

### Running E2E Smoke Tests (Playwright)
Playwright validates public page rendering, unauthenticated route guards, and admin authentication flows:
```bash
npm run test:e2e
```

### Production Build Validation
Verify that all TypeScript types, routes, and server components compile cleanly:
```bash
npm run build
```

---

## 9. License & Attribution

Designed and engineered for **Amit Krishna**, Director of Engineering - Industrial Digital Twin Platforms.
Protected by MIT License.
