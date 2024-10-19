import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Contact Us</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
        <form>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm sm:text-base">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 transition duration-200" 
              required 
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm sm:text-base">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 transition duration-200" 
              required 
            />
          </div>
          <div className="mb-6 sm:mb-8">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm sm:text-base">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={4} 
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 transition duration-200" 
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
