# Constituent Circle - Development To-Do List

**Last Updated:** 2025-03-30

This document tracks the development progress of the Constituent Circle application. It is based on the features outlined in the [constituent-prd.md](./constituent-prd.md) and the current state of the codebase.

## Stable Commits / Milestones

*   `(Placeholder: Add initial stable commit hash and description here once established)`

---

## Task List

**Key:**
*   `[ ]` - To Do
*   `[/]` - In Progress
*   `[x]` - Done
*   `(P#)` - Priority (P1=High, P2=Medium, P3=Low)

### Core Infrastructure & Setup

*   `[x]` (P1) Initialize Next.js project with TypeScript.
*   `[x]` (P1) Set up Tailwind CSS.
*   `[x]` (P1) Integrate Convex SDK and configure basic setup (`convex.json`, `env.local`).
*   `[x]` (P1) Define core database schema in `convex/schema.ts` (Users, Profiles, Sessions, etc.).
*   `[x]` (P1) Implement basic application layout (`app/layout.tsx`).
*   `[x]` (P1) Set up Convex Client Provider (`lib/ConvexClientProvider.tsx` or similar, ensure proper initialization - Memory `f7e2e3d3-ce2d-4375-a355-460311558e6c`, `96b5f307-156b-41a8-b6c5-6fc3f6021e8d`).
*   `[x]` (P1) Implement Theme Provider (Light/Dark mode) (`components/theme`, `app/layout.tsx` - Memory `60ff707c-e040-4626-969a-26e258185440`).
*   `[x]` (P1) Implement basic routing structure (App Router).
*   `[x]` (P1) Set up deployment pipeline (Vercel).
*   `[x]` (P1) Fix Convex `prebuild` script issues (`scripts/generate-convex.js` - Memory `df2e15cb-eb9b-4992-b7d8-9e4d8e6e8a87`).
*   `[ ]` (P2) Set up basic unit/integration testing framework (`__tests__`).
*   `[ ]` (P2) Configure Linting and Formatting (ESLint, Prettier).

### Authentication & Authorization (Auth)

*   `[x]` (P1) Implement User Signup (`app/auth/signup`, `convex/users_actions.ts::registerUser`).
*   `[x]` (P1) Implement User Login (`app/auth/login`, `convex/auth.ts::logIn`).
*   `[x]` (P1) Implement Admin Login (`app/admin/login`, `convex/auth.ts::logIn` - needs role check).
*   `[x]` (P1) Implement Password Hashing (bcrypt) (`convex/users_actions.ts` - Memory `a245140d-9b2f-4123-b74a-cb2535550f0d`).
*   `[x]` (P1) Implement Session Management (Create/Validate/Delete Sessions) (`convex/auth.ts`, `convex/authInternal.ts`).
*   `[x]` (P1) Implement Auth Context (`context/AuthContext.tsx`) for managing auth state.
*   `[x]` (P1) Implement Logout (`context/AuthContext.tsx`, `convex/auth.ts::logOut`).
*   `[x]` (P1) Protect routes based on authentication status (`app/(protected)` layout).
*   `[x]` (P1) Fix AuthContext hook dependency issues (Memory `ad62c492-2b54-4575-800f-2b6603c78604`, `058cdc59-1d8f-46ab-b9e1-d77bc8ddcab5`).
*   `[x]` (P1) Fix Convex Client initialization errors in AuthContext (Memory `c01d2428-3894-4971-9cd6-7a3a77f987b7`, `6d00c866-39cb-49a4-94ae-268a723d8a1a`).
*   `[x]` (P1) Fix Convex TypeScript/Runtime errors (Node vs. Convex runtime, imports) (Memory `38cd6673-244e-40f9-84d5-a953fb8bf000`, `d30d800d-e630-4895-bb94-dc1bde470de4`, `2e0f616b-12cc-4c6f-9bc8-a4758def970f`).
*   `[x]` (P1) Fix circular references in auth functions (Memory `a245140d-9b2f-4123-b74a-cb2535550f0d`).
*   `[ ]` (P1) Implement Role-Based Access Control (RBAC) middleware/checks for routes and API functions.
*   `[ ]` (P1) Ensure Admin login path correctly verifies the 'admin' role.
*   `[ ]` (P2) Implement case-insensitive email lookup during login (Memory `537e7caf-b006-438d-a663-8de643b9d722`).
*   `[ ]` (P2) Implement "Set Admin Password" functionality (`app/admin/set-password`, `convex/setAdminPassword.ts`).
*   `[ ]` (P3) Implement Password Reset flow.
*   `[ ]` (P3) Implement Two-Factor Authentication (2FA).

### User Features (Constituent & Representative)

*   `[ ]` (P1) Implement User Profile Creation/Editing UI (`app/(protected)/dashboard/profile` or similar).
*   `[ ]` (P1) Implement Backend for Profile Updates (`convex/users.ts::updateProfile` or similar mutation).
*   `[ ]` (P2) Implement Representative Profile specific fields (UI & Backend).
*   `[ ]` (P2) Implement Constituent Dashboard (`app/(protected)/dashboard/page.tsx` - enhance content).
*   `[ ]` (P2) Implement Representative Dashboard (`app/(protected)/dashboard/page.tsx` - conditional content based on role).
*   `[ ]` (P2) Implement Representative Directory (Search/Filter UI).
*   `[ ]` (P2) Implement Backend for Representative Search (`convex/users_queries.ts` or similar).
*   `[ ]` (P2) Implement "Find My Representative" functionality (UI + Backend - needs district logic).
*   `[ ]` (P2) Implement Messaging UI (Inbox, Compose, View Threads).
*   `[ ]` (P2) Implement Backend for Secure Messaging (`convex/communications.ts` - mutations/queries).
*   `[ ]` (P3) Implement Representative Broadcast Message functionality (UI & Backend).
*   `[ ]` (P3) Implement Groups/Forums UI (List, View, Create, Post).
*   `[ ]` (P3) Implement Backend for Groups/Forums (`convex/groups.ts` - TBD schema/functions).
*   `[ ]` (P3) Implement Information Hub/Feed UI for Representatives to post updates.
*   `[ ]` (P3) Implement Backend for Information Hub posts.

### Admin Features

*   `[x]` (P1) Implement basic Admin Layout (`app/admin/layout.tsx`, `components/admin/AdminHeader`, `components/admin/AdminSidebar`).
*   `[/]` (P1) Implement User Management Table/List (`app/admin/dashboard/users/page.tsx`).
*   `[ ]` (P1) Implement Backend for fetching users for Admin (`convex/admin_queries.ts::listUsers`).
*   `[ ]` (P1) Implement User Detail View for Admin.
*   `[ ]` (P1) Implement User Edit/Update functionality for Admin (UI + Backend Mutation).
*   `[ ]` (P1) Implement User Deactivation/Activation for Admin (UI + Backend Mutation).
*   `[ ]` (P2) Implement Role Management UI (Assign roles to users).
*   `[ ]` (P2) Implement Backend for Role Updates (`convex/users_mutations.ts` or similar).
*   `[ ]` (P2) Define specific permissions for all roles (`README.md` lists many).
*   `[ ]` (P2) Implement System Settings page (`app/admin/dashboard/system/page.tsx` - enhance).
*   `[ ]` (P2) Implement Backend for saving System Settings.
*   `[ ]` (P3) Implement Content Moderation tools.
*   `[ ]` (P3) Implement Analytics Dashboard data fetching and display (`app/(protected)/dashboard/analytics/page.tsx` needs data).

### UI/UX & General Improvements

*   `[x]` (P1) Ensure consistent Header/Navigation across all layouts (Memory `60ff707c-e040-4626-969a-26e258185440`).
*   `[ ]` (P2) Refine UI components for better aesthetics and usability.
*   `[ ]` (P2) Ensure responsiveness across all key pages.
*   `[ ]` (P2) Implement loading states for data fetching.
*   `[ ]` (P2) Implement comprehensive error handling and user feedback (e.g., toast notifications).
*   `[ ]` (P3) Improve Accessibility (WCAG compliance checks).

### Documentation & Maintenance

*   `[x]` (P1) Create initial README.md.
*   `[x]` (P1) Create PRD (`constituent-prd.md`).
*   `[x]` (P1) Create To-Do List (`todo.md`).
*   `[x]` (P1) Document Convex troubleshooting steps (`CONVEX-TROUBLESHOOTING.md` - Memory `925c92ad-b010-4334-92a1-cf5a5fd9073c`).
*   `[x]` (P1) Document Convex code patterns (`CONVEX-CODE-PATTERNS.md`).
*   `[x]` (P1) Document Development practices (`DEVELOPMENT.md`).
*   `[x]` (P1) Update README role list to include 'constituent' (Based on Memory `231e98ed-c4c3-488d-bfb5-519ae5b0f350` - *Self-correction: Verify if actually done*).
*   `[ ]` (P2) Add comprehensive inline code comments.
*   `[ ]` (P2) Expand testing coverage.
*   `[ ]` (P2) Keep dependencies updated.
*   `[ ]` (P2) Regularly update `todo.md` and add stable commit hashes.

