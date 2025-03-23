import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary dark:text-white">
          About Constituent Circle
        </h2>
        <div className="space-y-6 sm:space-y-8 text-base sm:text-lg">
          <p className="text-text-dark dark:text-text-light leading-relaxed">
            Constituent Circle creates AI-enabled tools for more effective,
            opinionated, goal-oriented communications, at scale, for
            representatives and constituents to be assured they are being heard
            by each other.
          </p>
          <p className="text-text-dark dark:text-text-light leading-relaxed">
            We believe in the power of representative democracy and are
            committed to addressing the growing disconnect between people
            and their elected officials. Our mission is to create, refine, and
            endlessly re-engineer solutions that bridge this gap.
          </p>
          <blockquote className="border-l-4 border-secondary pl-4 sm:pl-6 py-2 sm:py-4 bg-gray-100 dark:bg-gray-800 rounded-r-lg italic text-text-dark dark:text-text-light">
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
          <p className="text-text-dark dark:text-text-light leading-relaxed">
            Our vision is to enable representatives to conduct effective,
            opinionated, goal-oriented conversations with thousands or more
            individuals and groups, providing the superpowers needed in a
            modern representative democracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
