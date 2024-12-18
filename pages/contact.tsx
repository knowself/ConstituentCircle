import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Contact Us</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;