import React from 'react';
import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface TechnicalDetail {
  icon: string;
  title: string;
  description: string;
  link: string;
}

const ScalableConversationsPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: "🔄",
      title: "Intelligent Scaling",
      description: "Handle growing constituent volumes without compromising on quality or personal touch through smart workload distribution."
    },
    {
      icon: "🎯",
      title: "Topic Clustering",
      description: "Automatically group similar constituent concerns to efficiently address common issues while maintaining personalized responses."
    },
    {
      icon: "📝",
      title: "Response Templates",
      description: "Dynamic, AI-powered templates that adapt to constituent inquiries while maintaining your authentic voice."
    },
    {
      icon: "🔍",
      title: "Issue Tracking",
      description: "Monitor and track constituent issues across multiple conversations to identify trends and common concerns."
    },
    {
      icon: "🤝",
      title: "Collaborative Workflow",
      description: "Enable team members to work together seamlessly on constituent communications with smart task assignment and tracking."
    },
    {
      icon: "📊",
      title: "Volume Analytics",
      description: "Real-time insights into communication patterns and volume trends to help optimize resource allocation."
    }
  ];

  const technicalDetails: TechnicalDetail[] = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Advanced analytics and machine learning techniques to derive actionable insights from constituent communications.",
      link: "/services/scalable-conversations/data-analysis"
    },
    {
      icon: "🎯",
      title: "Targeted Outreach",
      description: "Precision-focused approaches to engage constituents on issues that matter most to them.",
      link: "/services/scalable-conversations/targeted-outreach"
    },
    {
      icon: "🔒",
      title: "Secure Communications",
      description: "Enterprise-grade security measures ensuring the confidentiality, integrity, and availability of all constituent communications.",
      link: "/services/scalable-conversations/secure-communications"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <Link 
          href="/services"
          className="text-secondary hover:text-primary mb-4 inline-block"
        >
          ← Back to Services
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Scalable Conversations
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Handle increasing constituent communication volumes while maintaining 
          meaningful, personal interactions through intelligent automation.
        </p>
      </div>

      {/* Main Features */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-8">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Deep-Dives */}
      <div className="mt-20">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-8">
          Technical Deep-Dives
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {technicalDetails.map((detail, index) => (
            <Link 
              key={index}
              href={detail.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{detail.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {detail.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {detail.description}
              </p>
              <span className="text-secondary hover:text-primary font-semibold">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Link 
          href="/contact"
          className="inline-block bg-secondary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Schedule a Demo
        </Link>
      </div>
    </div>
  );
};

export default ScalableConversationsPage;
