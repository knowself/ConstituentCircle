import React from 'react';

const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md">
    <div className="text-4xl mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
    <p className="text-text-dark">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
