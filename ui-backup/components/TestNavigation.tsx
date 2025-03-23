import React from 'react';

const TestNavigation = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div>Test Navigation Component</div>
          <div className="flex space-x-4">
            <a href="/" className="hover:underline">Home</a>
            <a href="/auth/signin" className="hover:underline">Login</a>
            <a href="/admin/login" className="hover:underline">Admin</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TestNavigation;