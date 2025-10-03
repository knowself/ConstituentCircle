# Contributing

- Convex is the sole persistence layer. Do not introduce Replit DB or Firebase Data Connect.
- Clerk is the only authentication provider. Prefer Clerk hooks/components over custom wrappers.
- Reflect any new secrets in `.env.example` and infrastructure configs.
- Add tests (Jest/Playwright) when adding Convex mutations/queries or protected flows.
- Keep CI green; run lint/typecheck locally before opening a PR.
