import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">About Constituent Circle</h2>
        <div className="space-y-6 text-text-dark">
          <p>
            Constituent Circle creates AI-enabled tools for more effective, opinionated, goal-oriented communications, at scale, for representatives and constituents to be assured they are being heard by each other.
          </p>
          <p>
            We believe in the power of representative democracy and are committed to addressing the growing disconnect between people and their elected officials. Our mission is to create, refine, and endlessly re-engineer solutions that bridge this gap.
          </p>
          <blockquote className="border-l-4 border-secondary pl-4 italic">
            "Many forms of Government have been tried, and will be tried in this world of sin and woe. No one pretends that democracy is perfect or all-wise. Indeed it has been said that democracy is the worst form of Government except for all those other forms that have been tried from time to time."
            <footer className="text-right mt-2 text-primary">- Winston Churchill, 1947</footer>
          </blockquote>
          <p>
            Our vision is to enable representatives to conduct effective, opinionated, goal-oriented conversations with thousands or more individuals and groups, providing the superpowers needed in a modern representative democracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
