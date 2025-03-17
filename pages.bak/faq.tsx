import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItem & { isOpen: boolean; toggle: () => void }> = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left focus:outline-none"
        onClick={toggle}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
        <svg
          className={`w-6 h-6 text-gray-500 transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-700 dark:text-gray-300">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is Constituent Circle?",
      answer: "Constituent Circle is a platform that creates AI-enabled tools for more effective, opinionated, goal-oriented communications at scale between representatives and constituents. Our mission is to ensure that both parties are heard and understood by each other, bridging the gap in representative democracy."
    },
    {
      question: "How does Constituent Circle work?",
      answer: "Constituent Circle leverages advanced AI technology to analyze and suggest effective communication strategies. It enables representatives to conduct meaningful conversations with thousands of constituents, providing the necessary tools for scalable and impactful interactions in a modern representative democracy."
    },
    {
      question: "Who can benefit from using Constituent Circle?",
      answer: "Constituent Circle is designed for elected officials, their staff, and constituents. It helps representatives engage more effectively with their constituents, and allows constituents to have their voices heard more clearly by their elected representatives."
    },
    {
      question: "Is my data safe with Constituent Circle?",
      answer: "Yes, we take data privacy and security very seriously. All communications and personal information are encrypted and stored securely. We adhere to strict privacy policies and comply with relevant data protection regulations."
    },
    {
      question: "How can I get started with Constituent Circle?",
      answer: "To get started, please contact our sales team through the contact form on our website. We'll be happy to provide you with more information, set up a demo, or discuss how we can tailor our solutions to your specific needs."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
