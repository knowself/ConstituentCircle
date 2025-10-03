# ConstituentCircle.com - Architecture Vision

## Executive Summary
ConstituentCircle.com is an AI-augmented communication platform designed to bridge the gap between representatives and their constituents. The platform combines conversational AI, structured workflows, and human oversight so elected officials and their teams can respond to large volumes of inbound messages without sacrificing authenticity.

## Core Mission and Values

### Mission Statement
To create AI-enabled tools that facilitate meaningful, goal-oriented communications at scale between representatives and constituents, ensuring both parties are heard and understood in representative democracies around the world.

### Key Values
- **Authentic Communication**: Maintain representatives' genuine voice while scaling interactions.
- **Democratic Engagement**: Foster meaningful dialogue between representatives and constituents.
- **Technical Clarity**: Operate on a transparent, maintainable stack so the team can iterate quickly.
- **Security and Trust**: Protect constituent data and meet compliance expectations.
- **Scalable Impact**: Support high message throughput without sacrificing usability.

## Technical Architecture

### Platform Foundation

#### Frontend
- **Framework**: Next.js 15 (App Router) with React 18 and TypeScript.
- **Styling**: Tailwind CSS design tokens plus custom components in `app/components` and `src/components`.
- **Auth UI**: Clerk widgets (SignIn, SignUp, UserButton) rendered via client components.
- **State**: Lightweight custom hooks built on Clerk + Convex; React state for local UI.

#### Authentication
- **Provider**: Clerk handles identity, session cookies, and social logins.
- **Middleware**: `middleware.ts` delegates route protection to `clerkMiddleware`.
- **Sync into Data Layer**: `EnsureUserOnLogin` mutation stores Clerk`s `user.id` inside Convex for domain lookups.

#### Backend & Persistence
- **Runtime**: Convex hosts serverless TypeScript functions for queries, mutations, and actions.
- **Schema**: Defined in `convex/schema.ts`; notable tables include `users`, `sessions`, `profiles`, `communications`, and `constituents`.
- **APIs**: Frontend calls Convex via generated clients (`convex/_generated/api`) using `convex/react` hooks or `ConvexHttpClient` where server access is needed.

#### Hosting & Delivery
- **Platform**: Vercel builds and hosts the Next.js frontend.
- **Build Pipeline**: `convex codegen` runs before `next build` (see `vercel.json`).
- **Static Assets**: Served through Next.js `public/` and Vercel edge network.

### Current Data Model Snapshot

| Table | Purpose | Key Fields/Indexes |
| --- | --- | --- |
| `users` | Canonical user record | `clerkId`, `email`, `role`, `createdAt`; indexed by `clerkId` & `email`. |
| `sessions` | Legacy session tokens (phasing out) | `userId`, `token`, `expiresAt`. |
| `profiles` | Representative/constituent details | Role, jurisdiction metadata, government level. |
| `communications` | Message history | `representativeId`, `constituentId`, `status`, timestamps. |
| `constituents` | Constituent addresses & districts | `userId`, `district`, structured address object. |

Convex enforces schema types at runtime. Queries run close to the data and stream results to the client via websockets when desired.

### AI & Integrations
- **OpenAI**: `lib/ai-services/openAIClient.ts` lazily initialises an OpenAI client when keys are provided. AI features are optional in environments without credentials.
- **Email**: Nodemailer is configured (via SMTP environment variables) for contact flows and system notifications.
- **Redis Stub**: `lib/redis/client.ts` remains available for future queueing/caching but is currently unused.

## Operational Picture

### Development Workflow
1. Install dependencies (`npm install`).
2. Run `npm run dev` to start the Next.js dev server and load Convex endpoints.
3. Update Convex schema/functions, then run `npx convex dev` (or rely on the dev server to restart when files change).
4. Use `npm run lint` and `npm run test` before push; `scripts/guard.sh` prevents reintroduction of deprecated Replit/Firebase assets.

### Environments
- **Local**: `.env.local` supplies Clerk + Convex keys; Convex dev server runs alongside `next dev`.
- **Preview / Production**: Vercel manages environment variables; Convex deployment URL is stored in `NEXT_PUBLIC_CONVEX_URL`.

### Monitoring & Debugging
- **Convex Dashboard**: Inspect logs, function traces, and data.
- **Clerk Dashboard**: Manage users and monitor auth events.
- **Debug Route**: `/debug/me` prints the Convex record for the signed-in Clerk user.

## Future Enhancements

| Area | Near-term goal |
| --- | --- |
| Admin Dashboards | Migrate remaining admin routes from legacy password workflows to pure Clerk auth. |
| Data Hygiene | Remove obsolete session tokens once all flows read from Clerk IDs. |
| Testing | Expand Jest + Playwright coverage around auth gating and Convex mutations. |
| Messaging | Layer in real delivery providers (email/SMS) behind Convex actions. |
| AI | Harden prompt libraries and add caching when OpenAI usage ramps up. |

## Conclusion
The stack is now intentionally concise: Clerk for identity, Convex for data and business logic, and Next.js on Vercel for delivery. This alignment removes ambiguity from earlier prototypes (Replit DB, Firebase Data Connect) and gives us a clear foundation for iterating on constituent–representative communication tools.
