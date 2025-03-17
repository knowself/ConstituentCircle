import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Unauthorized Access</h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
