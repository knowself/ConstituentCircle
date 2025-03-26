import React from 'react';

const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
    <div className="text-2xl sm:text-3xl mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <FeatureItem
            icon="✉️"
            title="Email-Focused Communication"
            description="Leverage advanced email technology to analyze and suggest effective communication strategies."
          />
          <FeatureItem
            icon="👥"
            title="Scalable Conversations"
            description="Enable representatives to conduct meaningful conversations with thousands of constituents."
          />
          <FeatureItem
            icon="🏛️"
            title="Empowering Democracy"
            description="Strengthen the connection between representatives and constituents for a more effective democracy."
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
