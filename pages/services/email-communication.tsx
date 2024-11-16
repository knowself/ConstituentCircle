import React from 'react';
import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const EmailCommunicationPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: "🤖",
      title: "AI-Powered Email Management",
      description: "Intelligent email categorization and routing ensures that every message reaches the right team member for optimal response handling."
    },
    {
      icon: "⚡",
      title: "Smart Response Generation",
      description: "AI-assisted response drafting that maintains your voice while significantly reducing response time."
    },
    {
      icon: "🎯",
      title: "Priority Intelligence",
      description: "Automatic identification of urgent matters and constituent priorities to help you focus on what matters most."
    },
    {
      icon: "📊",
      title: "Sentiment Analysis",
      description: "Real-time analysis of constituent sentiment to help you better understand and address their concerns."
    },
    {
      icon: "🔍",
      title: "Context Awareness",
      description: "Intelligent system that maintains conversation history and policy context for more informed responses."
    },
    {
      icon: "📈",
      title: "Performance Analytics",
      description: "Comprehensive metrics on response times, constituent satisfaction, and engagement levels."
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
          Email-Focused Communication
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Transform your constituent email management with AI-powered tools that ensure every message 
          receives a thoughtful, personalized response.
        </p>
      </div>

      {/* Main Content */}
      <div className="mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Email-Focused Communication?</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
            <p className="text-lg mb-4">
              Email remains the primary channel for constituent communication with their representatives. 
              Our platform recognizes this reality and transforms email from a potential bottleneck into 
              a powerful tool for democratic engagement.
            </p>
            <p className="text-lg mb-4">
              By leveraging advanced AI technology, we help offices manage increasing email volumes while 
              maintaining the personal touch that constituents expect and deserve.
            </p>
            <p className="text-lg">
              Our system doesn't just manage emails - it helps you understand constituent needs, track 
              emerging issues, and respond more effectively to your community's concerns.
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

export default EmailCommunicationPage;
