# Contributing to Constituent Circle

Thank you for your interest in contributing to Constituent Circle! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/constituent-circle.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Code Style

We use ESLint and Prettier to maintain code quality:

- Run `npm run lint` to check for linting issues
- Run `npm run format` to format code
- Git hooks will automatically format code on commit

## Testing

- Run `npm test` to run tests once
- Run `npm run test:watch` for watch mode
- Run `npm run test:coverage` for coverage report

## Pull Request Process

1. Update documentation as needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README.md with details of changes if needed
5. The PR will be merged once you have the sign-off of at least one maintainer

## Code of Conduct

Please note we have a code of conduct, please follow it in all your interactions with the project:

1. Use welcoming and inclusive language
2. Be respectful of differing viewpoints and experiences
3. Gracefully accept constructive criticism
4. Focus on what is best for the community
5. Show empathy towards other community members

## Questions?

If you have any questions, please open an issue or reach out to the maintainers.
