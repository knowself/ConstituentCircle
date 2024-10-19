import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Name</label>
            <input type="text" id="name" name="name" className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
            <input type="email" id="email" name="email" className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Message</label>
            <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" required></textarea>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
