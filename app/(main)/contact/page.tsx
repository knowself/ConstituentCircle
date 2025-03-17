'use client';

import React from 'react';
import { FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Our History</h1>
      
      <div className="mb-8 text-gray-700 dark:text-gray-300 space-y-6">
        <p>
          Founded in 2024, Constituent Circle is just the latest in a long American tradition of innovation in Democratic technology.
           When people normally think of the impact of AI, it's usually in the areas of Business productivity or manufacturing or medicine or law, but the business of our democratic institutions may be the most important application of this most impactful technology in the history of humankind.
          
          We are proud to define and lead in a category that can change people's lives for the better all over the world.
          </p>
        
        <p>
          Our journey is defined by our commitment to excellence, integrity, and the belief that the will of the people properly amplified will be the core of all that is right and true in our public lives.
        </p>
        
        <p>
        The Founding Fathers viewed the quest for "a more perfect union" as a dynamic processu2014one requiring compromise, adaptation, and dedication to liberty and justice. Through the Constitution, their speeches, and their writings like the Federalist Papers, they laid the groundwork for a nation capable of evolving, leaving it to each generation to carry forward the struggle. 
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        
        <div className="flex flex-col items-center text-center">
          <div className="text-blue-600 mb-4">
            <MdEmail size={48} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Email</h2>
          <a href="mailto:JoeTerry@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-lg mb-1">JoeTerry@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
