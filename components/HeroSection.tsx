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
          className="inline-block bg-secondary hover:bg-opacity-90 text-text-light font-bold py-3 px-6 rounded-lg text-lg sm:text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mb-16"
        >
          Learn More
        </Link>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">About Constituent Circle</h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Constituent Circle is an AI technology platform designed to enhance communication between representatives and their constituents. By leveraging artificial intelligence and natural language processing, we enable representatives to craft personalized, on-message communications efficiently while maintaining their authentic voice.
          </p>
          <blockquote className="max-w-3xl mx-auto border-l-4 border-secondary pl-4 sm:pl-6 py-2 sm:py-4 bg-gray-100 dark:bg-gray-800 rounded-r-lg italic text-text-dark dark:text-text-light mb-8 text-left">
            <p className="mb-2">
              "Many forms of Government have been tried, and will be tried in this
              world of sin and woe. No one pretends that democracy is perfect or
              all-wise. Indeed it has been said that democracy is the worst form
              of Government except for all those other forms that have been
              tried from time to time."
            </p>
            <footer className="text-right mt-2 text-primary dark:text-secondary font-semibold">
              - Winston Churchill, 1947
            </footer>
          </blockquote>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Our goal is to facilitate meaningful, goal-oriented conversations at scale, ensuring that constituents feel heard and represented, regardless of the communication channel. We believe in the power of representative democracy and are committed to addressing the growing disconnect between people and their elected officials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
