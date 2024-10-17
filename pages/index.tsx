import React from 'react';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Welcome to Constituent Circle
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            AI-Enabled Tools for a Representative Democracy
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Key Features
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5">
                  <li>Secure User Authentication</li>
                  <li>Email Management</li>
                  <li>AI-Powered Response Suggestions</li>
                  <li>Template Library</li>
                  <li>Constituent Profile Management</li>
                  <li>Analytics Dashboard</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
