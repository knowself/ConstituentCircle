import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function TestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Head>
        <title>Test Page</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Test Page</h1>
        <p>This is a simple test page to verify that Next.js is working correctly.</p>
        <p>Client-side rendering status: {mounted ? 'Mounted' : 'Not mounted'}</p>
      </main>
    </div>
  );
}
