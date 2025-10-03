# Architecture

- Identity: **Clerk**
- Data & server functions: **Convex**
- Frontend: **Next.js App Router**

## Rules
- Define data structures in `convex/schema.ts` and implement behaviour in `convex/*.ts`.
- Use Clerk hooks/components for authentication; do not roll custom auth contexts.
- Protect routes via `middleware.ts` (Clerk).
- When adding env vars, update `.env.example` and Vercel config consistently.
