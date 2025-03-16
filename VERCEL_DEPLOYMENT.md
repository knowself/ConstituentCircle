# Vercel Deployment Guide for Constituent Circle

This guide provides instructions for deploying the Constituent Circle application to Vercel, with a focus on resolving common issues related to Convex integration.

## Prerequisites

- A Vercel account
- A Convex account with a deployed backend
- Your Convex deployment URL

## Environment Variables

The following environment variables must be set in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|--------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL | `https://energetic-mammal-123.convex.cloud` |
| `NEXT_PUBLIC_ENV` | Environment ("prod" or "dev") | `prod` |

## Deployment Steps

1. **Connect your repository to Vercel**
   - Go to [Vercel](https://vercel.com) and create a new project
   - Connect your GitHub/GitLab/Bitbucket repository

2. **Configure environment variables**
   - In the Vercel project settings, add all required environment variables
   - Make sure `NEXT_PUBLIC_CONVEX_URL` is correctly set to your Convex deployment URL

3. **Configure build settings**
   - Framework preset: Next.js
   - Build command: `npm run build` (this will automatically run the prebuild script)
   - Output directory: `.next`

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

## Troubleshooting Common Issues

### "Client created with undefined deployment address"

This error occurs when the Convex client is initialized without a valid URL. To fix:

1. Verify that `NEXT_PUBLIC_CONVEX_URL` is set correctly in your Vercel environment variables
2. Make sure the environment variable is accessible during build time
3. Check that the Convex client is only initialized on the client side

### Missing Convex generated files

If you encounter errors related to missing Convex generated files during build:

1. The prebuild script should automatically generate these files
2. If issues persist, you can manually run `npx convex codegen` locally and commit the generated files

### TypeScript errors during build

If TypeScript errors are preventing deployment:

1. Fix the TypeScript errors locally if possible
2. If you need to deploy despite TypeScript errors, the `ignoreBuildErrors` option is enabled in `next.config.js` for Vercel deployments

## Testing Your Deployment

After deployment, verify that:

1. The application loads without errors
2. Authentication works correctly
3. Convex data is being fetched and displayed properly
4. All features are functioning as expected

If you encounter any issues, check the Vercel build logs and runtime logs for more detailed error information.
