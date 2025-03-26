# Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Custom components with Heroicons (v2.0.18)
- **Analytics**: Vercel Analytics (v1.1.1)

### Backend
- **Database & Backend**: Convex 1.20.0
- **Authentication**: Convex Auth
- **API**: Convex Functions (Queries, Mutations, Actions)
- **Real-time Data**: Convex real-time subscriptions

### Deployment & Infrastructure
- **Hosting**: Vercel
- **CI/CD**: Vercel's GitHub integration
- **Environment Variables**: Managed through Vercel and .env files

## Development Environment

### Prerequisites
- Node.js (version specified in .nvmrc)
- npm or yarn
- Git

### Setup Instructions
1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env.local` and configure environment variables
4. Start the development server with `npm run dev`

### Development Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Project Structure

```
constituent-circle/
├── app/                  # Next.js app directory (App Router)
│   ├── (auth)/           # Authentication-related routes
│   ├── (main)/           # Main application routes
│   ├── (protected)/      # Protected routes requiring authentication
│   ├── admin/            # Admin panel routes
│   ├── api/              # API routes
│   ├── constituent/      # Constituent-specific routes
│   └── ...
├── components/           # Reusable React components
├── context/              # React Context providers
├── convex/               # Convex backend functions
│   ├── schema.ts         # Database schema
│   ├── auth.ts           # Authentication functions
│   ├── users.ts          # User-related functions
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Convex Backend

### Schema
The database schema is defined in `convex/schema.ts` and includes tables for:
- Users
- Profiles
- Representatives
- Communications
- Tasks
- Admin users

### Authentication
Authentication is handled through Convex Auth, with custom logic in:
- `convex/auth.ts`
- `convex/authInternal.ts`
- `context/AuthContext.tsx`
- `hooks/useAuth.ts`

### API Structure
Convex functions are organized by domain:
- `users_queries.ts`, `users_mutations.ts`, `users_actions.ts`: User-related functions
- `communications.ts`: Communication-related functions
- `constituents.ts`: Constituent-related functions
- `admin_queries.ts`: Admin-specific queries

## Third-Party Integrations

### Current Integrations
- **Vercel Analytics**: For application usage tracking
- **Nodemailer**: For email communications (v6.4.17)
- **AI Services**: Integration with AI models for certain features

### Planned Integrations
- **Payment Processing**: For donation features
- **SMS Notifications**: For mobile alerts
- **Social Media Authentication**: For simplified login

## Development Workflows

### Feature Development
1. Create a new branch from `main`
2. Implement the feature with appropriate tests
3. Submit a pull request for review
4. Address review feedback
5. Merge to `main` after approval

### Deployment
1. Changes to `main` automatically deploy to the staging environment
2. After verification, promote to production through the Vercel dashboard

### Testing
- Unit tests with Jest
- Component tests with React Testing Library
- End-to-end tests with Playwright

## Performance Considerations

### Frontend
- Server-side rendering for initial page load performance
- Client-side navigation for subsequent page transitions
- Image optimization through Next.js Image component
- Code splitting and lazy loading

### Backend
- Efficient Convex queries with appropriate indexes
- Pagination for large data sets
- Optimistic UI updates with real-time synchronization

## Security Measures

- Authentication through Convex Auth
- Role-based access control
- Input validation with Convex validators
- HTTPS for all communications
- Environment variable protection
- Regular dependency updates

## Monitoring and Logging

- Application errors tracked through Vercel
- Convex logging for backend operations
- Custom error boundaries for graceful failure handling

## Technical Debt and Improvement Areas

- Comprehensive test coverage
- Performance optimization for complex queries
- Mobile responsiveness improvements
- Accessibility enhancements
- Documentation expansion