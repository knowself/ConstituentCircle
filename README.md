# Constituent Circle

## The Mission

Constituent Circle creates AI-enabled tools for more effective, opinionated, goal-oriented communications, at scale, for representatives and constituents to be assured they are being heard by each other.

Our vision is to enable representatives to conduct, at scale, effective, opinionated, goal-oriented conversations with thousands, tens of thousands or more individuals and groups. This is our vision of the kinds of super powers representatives in a representative democracy need.

## Current Technology Stack

| Layer | What we use | Notes |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS | App Router structure under `app/`, Tailwind for design tokens, client/server components mixed where sensible. |
| Authentication | [Clerk](https://clerk.com/) | ClerkProvider wraps the app, UI widgets (SignIn, SignUp, UserButton) power all auth flows. |
| Persistence & APIs | [Convex](https://www.convex.dev/) | Convex hosts schema, queries, mutations, and actions. Clerk identities are synced into Convex tables via `convex/users.ts`. |
| AI integrations | OpenAI SDK (optional) | `lib/ai-services/openAIClient.ts` bootstraps OpenAI when a key is present. |
| Mail & notifications | Nodemailer (SMTP) | Configurable via environment variables; used for contact flows. |
| Hosting & CI/CD | Vercel | `vercel.json` drives deploys, `next build` + `convex codegen` run in CI. |

### Backend Data Model

Convex is the single source of truth. Key tables live in `convex/schema.ts`:

- `users` & `sessions` – user records keyed by Clerk `clerkId`, session tokens for legacy features still required by the app.
- `profiles`, `communications`, `constituents` – domain entities for representative/constituent data and messaging history.

Convex helpers:

- `convex/users.ts` – `ensureUser` mutation upserts Clerk users into Convex; `me` query exposes the logged-in user.
- `convex/auth.ts` – legacy password-based actions slated for removal once all routes are Clerk-only.

### Auth Flow

- `app/layout.tsx` wraps the tree with `ClerkProvider` and project-wide client providers.
- `app/components/EnsureUserOnLogin.tsx` runs on the client to sync Clerk identities into Convex.
- Navigation and dashboards rely on `src/hooks/useAuth.ts`, which merges Clerk session state with Convex user documents.
- Sign-in/up pages live under `app/auth/*` and simply render Clerk components.

### Development Tooling

- `npm run dev` – Next.js dev server (ensure `npm install` has run first).
- `npm run lint` – ESLint with Next.js config.
- `npm run test` – Jest suite (WIP coverage).
- `scripts/guard.sh` – CI helper that blocks reintroduction of deprecated Replit/Firebase assets.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```dotenv
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Convex
NEXT_PUBLIC_CONVEX_URL="https://your-convex-instance.convex.cloud"
CONVEX_DEPLOYMENT=""
CONVEX_SITE_URL=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional integrations
OPENAI_API_KEY=""
SMTP_HOST=""
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=""
SMTP_PASSWORD=""
CONTACT_EMAIL_TO=""
CONTACT_EMAIL_FROM=""
```

Remove any `REPLIT_*` or Firebase Data Connect variables—those systems are no longer used.

### Debugging

- Visit `/debug/me` while signed in to inspect the Convex document linked to your Clerk identity.
- Convex function logs surface in the Convex dashboard; client-side auth issues appear in the browser console.

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 8.0.0

### Installation

```bash
git clone https://github.com/yourusername/constituent-circle.git
cd constituent-circle
npm install
npm run dev
```

## Contributing

See `CONTRIBUTING.md` for guardrails. The high points:

- Clerk is the only auth provider. Do not reintroduce custom password flows without approval.
- Convex is the only persistence layer. Add tables/queries/mutations under `convex/`.
- Update docs and `.env.example` when adding new configuration.

## License

ISC
