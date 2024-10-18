import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Empowering Representative Democracy
        </h1>
        <p className="text-xl sm:text-2xl mb-8">
          AI-enabled tools for effective, opinionated, goal-oriented communications
          between representatives and constituents.
        </p>
        <button className="bg-secondary hover:bg-opacity-90 text-text-light font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
