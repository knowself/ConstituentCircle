import { Inter } from 'next/font/google';
import AuthNavHeader from '../components/AuthNavHeader';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLoginLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50 dark:bg-gray-900">
      <body className={`h-full ${inter.className}`}>
        <div className="bg-red-500 text-white p-2">Layout is working</div>
        <AuthNavHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}