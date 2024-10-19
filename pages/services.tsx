import React from 'react';
import Link from 'next/link';

interface Service {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<Service> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform duration-300 ease-in-out transform hover:scale-105">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const ServicesPage: React.FC = () => {
  const services: Service[] = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Leverage AI to analyze constituent communications and identify key trends and issues."
    },
    {
      icon: "💬",
      title: "Automated Responses",
      description: "Generate personalized, context-aware responses to constituent inquiries at scale."
    },
    {
      icon: "🎯",
      title: "Targeted Outreach",
      description: "Identify and engage with constituents on issues that matter most to them."
    },
    {
      icon: "📈",
      title: "Performance Metrics",
      description: "Track and analyze the effectiveness of your constituent communications and engagements."
    },
    {
      icon: "🤝",
      title: "Constituent Relationship Management",
      description: "Maintain and nurture relationships with constituents through intelligent, data-driven interactions."
    },
    {
      icon: "🔒",
      title: "Secure Communications",
      description: "Ensure all constituent communications are encrypted and comply with data protection regulations."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white text-center">Our Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Ready to transform your constituent communications?</h2>
        <p className="text-blue-600 dark:text-blue-300 mb-6">Contact us today to learn how Constituent Circle can empower your representative democracy.</p>
        <Link href="/contact" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 inline-block">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
