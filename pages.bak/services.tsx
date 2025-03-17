/**
 * Services Page
 * 
 * Main services overview page that showcases our platform's key features and capabilities.
 * This page serves as a hub for all technical service offerings and provides navigation
 * to detailed technical pages.
 * 
 * Page Sections:
 * - Hero Section: Main banner with value proposition
 * - Services Grid: Overview of technical capabilities
 * - Technical Deep-Dives: Links to detailed technical pages
 * 
 * @module Pages
 */

import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';

/**
 * Feature interface defining the structure of each feature card
 * @interface Feature
 */
interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

/**
 * TechnicalService interface defining the structure of each technical service card
 * @interface TechnicalService
 */
interface TechnicalService {
  icon: string;
  title: string;
  description: string;
  link: string;
  techDetails?: string;
  features: string[];
  benefits: string[];
}

/**
 * FeatureCard Component
 * Displays individual feature information in a consistent card format
 * 
 * @component
 * @param {Feature} props - Feature properties
 */
const FeatureCard: React.FC<Feature> = ({ icon, title, description, link }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <Link 
      href={link}
      className="mt-auto text-secondary hover:text-primary transition-colors duration-200 font-semibold"
    >
      Learn More →
    </Link>
  </div>
);

/**
 * TechnicalServiceCard Component
 * Displays individual technical service information in a consistent card format
 * 
 * @component
 * @param {TechnicalService} props - TechnicalService properties
 */
const TechnicalServiceCard: React.FC<TechnicalService> = ({ 
  icon, 
  title, 
  description, 
  link, 
  techDetails,
  features,
  benefits
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <div className="text-4xl mr-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
    
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Key Features
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>

    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Benefits
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
    </div>

    {techDetails && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">{techDetails}</p>
    )}
    
    <Link 
      href={link}
      className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg transition-colors duration-200 font-semibold"
    >
      View Technical Details
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

/**
 * ServicesPage Component
 * Main page component that organizes and displays all service offerings
 * 
 * @component
 * @returns {JSX.Element} Rendered page component
 */
const ServicesPage: React.FC = () => {
  // Main feature data array - extend or modify to update feature offerings
  const mainFeatures: Feature[] = [
    {
      icon: "✉️",
      title: "Email-Focused Communication",
      description: "Revolutionize constituent communication with AI-powered email management, ensuring every message receives a thoughtful, personalized response.",
      link: "/services/email-communication"
    },
    {
      icon: "🔄",
      title: "Scalable Conversations",
      description: "Handle increasing volumes of constituent interactions while maintaining quality and personal touch through intelligent automation.",
      link: "/services/scalable-conversations"
    },
    {
      icon: "🏛️",
      title: "Empowering Democracy",
      description: "Strengthen democratic representation by enabling meaningful, efficient dialogue between representatives and constituents.",
      link: "/services/empowering-democracy"
    }
  ];

  // Technical service data array - extend or modify to update technical service offerings
  const technicalServices: TechnicalService[] = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Advanced analytics engine that transforms constituent communications into actionable insights.",
      link: "/services/scalable-conversations/data-analysis",
      techDetails: "Powered by state-of-the-art NLP and machine learning models",
      features: [
        "Natural Language Processing for sentiment analysis",
        "Trend detection and topic modeling",
        "Constituent behavior analytics",
        "Predictive analytics for issue forecasting"
      ],
      benefits: [
        "Identify emerging constituent concerns early",
        "Understand sentiment patterns across demographics",
        "Optimize response strategies based on data",
        "Make informed policy decisions"
      ]
    },
    {
      icon: "🎯",
      title: "Targeted Outreach",
      description: "AI-powered constituent engagement platform for precision communication and personalized outreach.",
      link: "/services/scalable-conversations/targeted-outreach",
      techDetails: "Utilizes machine learning for advanced segmentation and personalization",
      features: [
        "AI-powered constituent segmentation",
        "Geographic and demographic targeting",
        "Issue-based engagement tracking",
        "Multi-channel outreach optimization"
      ],
      benefits: [
        "Increase constituent engagement rates",
        "Improve response relevancy",
        "Optimize resource allocation",
        "Build stronger constituent relationships"
      ]
    },
    {
      icon: "🔒",
      title: "Secure Communications",
      description: "Enterprise-grade security infrastructure ensuring the confidentiality and integrity of all constituent interactions.",
      link: "/services/scalable-conversations/secure-communications",
      techDetails: "Implements military-grade encryption and security protocols",
      features: [
        "End-to-end encryption (AES-256)",
        "Role-based access control",
        "Audit logging and compliance tracking",
        "Multi-factor authentication"
      ],
      benefits: [
        "Ensure constituent data privacy",
        "Meet regulatory compliance requirements",
        "Prevent unauthorized access",
        "Maintain trust and transparency"
      ]
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumb 
        items={[
          { label: 'Services', href: '/services' }
        ]} 
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Core Capabilities
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Transforming representative democracy through innovative AI-powered communication solutions.
        </p>
      </div>

      {/* Main Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {mainFeatures.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Technical Services */}
      <div className="mt-20 bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
            Technical Deep-Dive
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-2 mb-4">
            Advanced Technical Capabilities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our enterprise-grade features powered by cutting-edge AI and security technologies
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {technicalServices.map((service, index) => (
            <TechnicalServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <Link 
          href="/contact"
          className="inline-block bg-secondary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Schedule a Demo
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
