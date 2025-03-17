import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';

interface MetricProps {
  label: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricProps> = ({ label, value, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </h3>
    <div className="text-3xl font-bold text-secondary mb-2">{value}</div>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

const TargetedOutreachPage: React.FC = () => {
  const metrics = [
    {
      label: "Engagement Rate",
      value: "85%",
      description: "Average increase in constituent engagement"
    },
    {
      label: "Response Time",
      value: "-60%",
      description: "Reduction in average response time"
    },
    {
      label: "Accuracy",
      value: "95%",
      description: "Targeting precision rate"
    },
    {
      label: "Coverage",
      value: "100%",
      description: "Of constituent demographics"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb 
        items={[
          { label: 'Services', href: '/services' },
          { label: 'Scalable Conversations', href: '/services/scalable-conversations' },
          { label: 'Targeted Outreach', href: '/services/scalable-conversations/targeted-outreach' }
        ]} 
      />

      <div className="text-center mb-12">
        <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
          Technical Deep-Dive
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
          Targeted Outreach
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Precision-focused constituent engagement powered by advanced AI segmentation
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Overview Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our targeted outreach platform uses sophisticated AI algorithms to segment constituents 
            and personalize communications at scale. This enables precise, relevant engagement while 
            maintaining authenticity and personal touch.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Key Benefits
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Higher engagement rates through personalization</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Efficient resource allocation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Improved constituent satisfaction</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Data-driven engagement strategies</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Features Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Technical Features
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                AI-Powered Segmentation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced machine learning algorithms for precise constituent grouping.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Behavioral pattern analysis</li>
                <li>Interest-based clustering</li>
                <li>Dynamic segment updates</li>
                <li>Custom segmentation rules</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Geographic Targeting
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Location-based engagement optimization using advanced mapping.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>District-level targeting</li>
                <li>Neighborhood analysis</li>
                <li>Location-based insights</li>
                <li>Geographic engagement patterns</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Multi-Channel Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Intelligent channel selection and timing for maximum impact.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Channel preference learning</li>
                <li>Optimal timing prediction</li>
                <li>Cross-channel coordination</li>
                <li>Engagement tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Process */}
      <div className="bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            Implementation Process
          </h2>
          <div className="space-y-8">
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Data Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect and consolidate constituent data from multiple sources.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Segmentation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered analysis to create meaningful constituent segments.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Strategy Development</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create targeted engagement strategies for each segment.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Execution & Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Launch campaigns and track performance metrics in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          See Targeted Outreach in Action
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Experience how our AI-powered targeting can transform your constituent engagement.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/contact"
            className="inline-block bg-secondary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Schedule a Demo
          </Link>
          <Link 
            href="/services/scalable-conversations"
            className="inline-block bg-white dark:bg-gray-800 text-secondary hover:text-primary border-2 border-secondary hover:border-primary font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TargetedOutreachPage;
