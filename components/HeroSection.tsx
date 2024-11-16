import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Empowering Representative Democracy with AI
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-enabled tools for effective, opinionated, goal-oriented communications
          between representatives and constituents.
        </p>
        <Link 
          href="/services" 
          className="inline-block bg-secondary hover:bg-opacity-90 text-text-light font-bold py-3 px-6 rounded-lg text-lg sm:text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
