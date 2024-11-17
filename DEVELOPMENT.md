# Development Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

## Setup Development Environment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/constituent-circle.git
   cd constituent-circle
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your local configuration.

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Project Structure

```
constituent-circle/
├── components/          # Reusable React components
├── pages/              # Next.js pages and API routes
├── styles/             # Global styles and Tailwind config
├── public/             # Static assets
├── types/              # TypeScript type definitions
├── __tests__/          # Test files
├── .next/              # Next.js build output
└── node_modules/       # Dependencies
```

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Code Style**
   - We use ESLint and Prettier for consistent code style
   - Format code before committing:
     ```bash
     npm run format
     ```
   - Check linting:
     ```bash
     npm run lint
     ```

3. **Testing**
   - Write tests for new features
   - Run tests:
     ```bash
     npm test
     ```
   - Check coverage:
     ```bash
     npm run test:coverage
     ```

4. **Committing Changes**
   - Git hooks will automatically format code
   - Use conventional commit messages:
     ```
     feat: add new feature
     fix: resolve bug
     docs: update documentation
     style: format code
     refactor: restructure code
     test: add tests
     chore: update dependencies
     ```

5. **Pull Request**
   - Update documentation if needed
   - Ensure all tests pass
   - Request review from team members

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Check code style
- `npm run format`: Format code
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate coverage report

## Code Organization

### Components
- One component per file
- Place tests in `__tests__` directory
- Include prop types and documentation
```typescript
interface Props {
  title: string;
  onClick: () => void;
}

export const Button: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### Pages
- Follow Next.js file-based routing
- Include SEO metadata
- Keep page components thin
```typescript
import { NextPage } from 'next';
import Head from 'next/head';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Constituent Circle</title>
      </Head>
      <main>
        {/* Page content */}
      </main>
    </>
  );
};

export default HomePage;
```

### Styles
- Use Tailwind CSS utilities
- Create custom utilities in `styles/globals.css`
- Follow BEM naming convention for custom classes

## Performance Considerations

1. **Code Splitting**
   - Use dynamic imports for large components
   - Lazy load images and components

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before committing

3. **State Management**
   - Use React Query for server state
   - Context API for global UI state
   - Local state for component-specific state

## Debugging

1. **Browser DevTools**
   - React DevTools for component inspection
   - Network tab for API calls
   - Console for logs

2. **VS Code**
   - Use Chrome Debugger extension
   - Set breakpoints in editor
   - Debug tests with Jest extension

## Common Issues

1. **Build Errors**
   - Clear `.next` directory
   - Delete `node_modules` and reinstall
   - Check Node.js version

2. **Type Errors**
   - Update TypeScript definitions
   - Check import paths
   - Verify prop types

3. **Test Failures**
   - Check test environment setup
   - Update snapshots if needed
   - Verify mock data

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
