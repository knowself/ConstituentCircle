import React from 'react';

const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
    <div className="text-4xl mb-4 text-primary dark:text-secondary">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-primary dark:text-text-light">{title}</h3>
    <p className="text-text-dark dark:text-text-light">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary dark:text-text-light">Our Features</h2>
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
