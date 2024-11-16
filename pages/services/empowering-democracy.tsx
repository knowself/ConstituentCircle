import React from 'react';
import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const EmpoweringDemocracyPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: "🗣️",
      title: "Voice Amplification",
      description: "Ensure every constituent's voice is heard and acknowledged through efficient, meaningful engagement."
    },
    {
      icon: "🔄",
      title: "Feedback Loops",
      description: "Create effective feedback channels between representatives and constituents to strengthen democratic dialogue."
    },
    {
      icon: "📊",
      title: "Issue Analytics",
      description: "Gain deep insights into constituent concerns and priorities through advanced data analytics."
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description: "Foster stronger connections between representatives and their communities through meaningful interactions."
    },
    {
      icon: "⚖️",
      title: "Representative Insights",
      description: "Make informed decisions with comprehensive understanding of constituent needs and preferences."
    },
    {
      icon: "🎯",
      title: "Targeted Action",
      description: "Transform constituent feedback into actionable insights for more effective policy-making and representation."
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
          Empowering Democracy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Strengthen democratic representation by enabling meaningful dialogue and 
          understanding between representatives and constituents.
        </p>
      </div>

      {/* Main Content */}
      <div className="mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Empowering Democracy Matters</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
            <p className="text-lg mb-4">
              In today's fast-paced world, maintaining meaningful democratic engagement 
              can be challenging. Our platform bridges this gap by making constituent 
              communication more efficient and effective.
            </p>
            <p className="text-lg mb-4">
              We believe that strong democracy requires both representatives and constituents 
              to be heard and understood. Our AI-powered tools facilitate this two-way 
              dialogue, making democratic representation more responsive and effective.
            </p>
            <p className="text-lg">
              By streamlining communication and providing valuable insights, we help 
              representatives better understand and serve their constituents, ultimately 
              strengthening the democratic process.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

export default EmpoweringDemocracyPage;
