import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 dark:text-blue-500">404</h1>
        <h2 className="mt-4 text-3xl font-medium text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The page you are looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
