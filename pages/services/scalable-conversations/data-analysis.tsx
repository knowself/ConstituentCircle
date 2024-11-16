/**
 * Data Analysis Page
 * 
 * Technical deep-dive page showcasing our advanced data analysis capabilities
 * for constituent communication insights. This page demonstrates how we process,
 * analyze, and visualize communication data to derive actionable insights.
 * 
 * Key Features:
 * - Performance metrics visualization
 * - Technical implementation details
 * - Data processing pipeline explanation
 * - Interactive demo components
 * 
 * @module Pages/Technical
 */

import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';

/**
 * Interface for performance metric cards
 * @interface Metric
 * @property {string} title - Metric name
 * @property {string} value - Current metric value
 * @property {string} change - Percentage change
 * @property {string} description - Detailed explanation
 */
interface Metric {
  title: string;
  value: string;
  change: string;
  description: string;
}

/**
 * Interface for implementation step cards
 * @interface ImplementationStep
 * @property {string} title - Step name
 * @property {string} description - Step details
 * @property {string[]} features - Key features or components
 */
interface ImplementationStep {
  title: string;
  description: string;
  features: string[];
}

/**
 * MetricCard Component
 * Displays individual performance metrics with change indicators
 * 
 * @component
 * @param {Metric} props - Performance metric properties
 */
const MetricCard: React.FC<Metric> = ({ title, value, change, description }) => {
  const isPositive = !change.startsWith('-');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  );
};

/**
 * ImplementationStepCard Component
 * Displays individual implementation steps with features
 * 
 * @component
 * @param {ImplementationStep} props - Implementation step properties
 */
const ImplementationStepCard: React.FC<ImplementationStep> = ({ title, description, features }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <svg className="h-6 w-6 text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * DataAnalysisPage Component
 * Main page component for data analysis technical deep-dive
 * 
 * @component
 * @returns {JSX.Element} Rendered page component
 */
const DataAnalysisPage: React.FC = () => {
  // Performance metrics data - extend or modify to update metrics
  const metrics: Metric[] = [
    {
      title: "Processing Speed",
      value: "2.5ms",
      change: "-0.5ms",
      description: "Average time to process and analyze a constituent message"
    },
    {
      title: "Accuracy Rate",
      value: "99.2%",
      change: "+1.2%",
      description: "Message classification and sentiment analysis accuracy"
    },
    {
      title: "Daily Insights",
      value: "50K+",
      change: "+15%",
      description: "Number of unique insights generated per day"
    },
    {
      title: "Response Time",
      value: "45s",
      change: "-30%",
      description: "Average time to generate response suggestions"
    }
  ];

  // Implementation steps data - extend or modify to update implementation process
  const implementationSteps: ImplementationStep[] = [
    {
      title: "Data Collection",
      description: "Secure, compliant collection of constituent communication data",
      features: [
        "Multi-channel data ingestion",
        "Real-time processing pipeline",
        "Privacy-preserving collection",
        "Data validation and cleaning"
      ]
    },
    {
      title: "Analysis Engine",
      description: "Advanced NLP and machine learning analysis pipeline",
      features: [
        "Sentiment analysis",
        "Topic classification",
        "Entity recognition",
        "Trend identification"
      ]
    },
    {
      title: "Insight Generation",
      description: "Automated extraction of actionable insights",
      features: [
        "Pattern recognition",
        "Anomaly detection",
        "Demographic analysis",
        "Geographic clustering"
      ]
    },
    {
      title: "Visualization",
      description: "Interactive dashboards and reporting tools",
      features: [
        "Real-time metrics",
        "Custom report generation",
        "Interactive visualizations",
        "Export capabilities"
      ]
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Navigation breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Services', href: '/services' },
          { label: 'Scalable Conversations', href: '/services/scalable-conversations' },
          { label: 'Data Analysis', href: '/services/scalable-conversations/data-analysis' }
        ]} 
      />

      {/* Page header section */}
      <div className="text-center mb-12">
        <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
          Technical Deep-Dive
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
          Data Analysis Engine
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Advanced analytics and machine learning pipeline for extracting actionable insights
          from constituent communications.
        </p>
      </div>

      {/* Performance metrics grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
          Performance Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Implementation process section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
          Implementation Process
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {implementationSteps.map((step, index) => (
            <ImplementationStepCard key={index} {...step} />
          ))}
        </div>
      </div>

      {/* Technical demo section */}
      <div className="bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Interactive Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Experience our data analysis capabilities firsthand with our interactive demo.
          </p>
          <Link
            href="/demo/data-analysis"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-primary"
          >
            Try Demo
          </Link>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Ready to Transform Your Data?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Learn how our advanced analytics can help you better understand and serve your constituents.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-primary"
          >
            Schedule a Demo
          </Link>
          <Link
            href="/documentation"
            className="inline-flex items-center px-6 py-3 border-2 border-secondary text-base font-medium rounded-md text-secondary hover:text-primary hover:border-primary"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisPage;
