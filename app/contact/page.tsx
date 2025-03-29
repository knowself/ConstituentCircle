'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-foreground dark:text-text-light p-8">
      {/* Removed duplicate navigation */}
      
      <main>
        <h1 className="text-3xl font-bold mb-6">Our History</h1>
        
        <div className="mb-8 space-y-6">
          <p>
            Founded in 2024, Constituent Circle is just the latest in a long American tradition of innovation in Democratic technology.
            When people normally think of the impact of AI, it's usually in the areas of Business productivity or manufacturing or medicine or law, but the business of our democratic institutions may be the most important application of this most impactful technology in the history of humankind.
            
            We are proud to define and lead in a category that can change people's lives for the better all over the world.
          </p>
          
          <p>
            Our journey is defined by our commitment to excellence, integrity, and the belief that the will of the people properly amplified will be the core of all that is right and true in our public lives.
          </p>
          
          <p>
            The Founding Fathers viewed the quest for "a more perfect union" as a dynamic process—one requiring compromise, adaptation, and dedication to liberty and justice. Through the Constitution, their speeches, and their writings like the Federalist Papers, they laid the groundwork for a nation capable of evolving, leaving it to each generation to carry forward the struggle.
          </p>
        </div>
        
        <div className="mt-12">
          <div className="flex flex-col items-center text-center p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="text-primary dark:text-secondary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-foreground dark:text-text-light">Email</h2>
            <a href="mailto:contact@constituentcircle.com" className="text-primary dark:text-secondary hover:underline text-lg mb-1">contact@constituentcircle.com</a>
          </div>
        </div>
      </main>
      
      <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
        </p>
      </footer>
    </div>
  );
}