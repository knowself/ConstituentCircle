/**
 * Secure Communications Page
 * 
 * This page provides detailed information about the platform's security features,
 * compliance standards, and security architecture. It follows a modular component
 * structure for easier maintenance and updates.
 * 
 * Key Features:
 * - Enterprise-grade security features presentation
 * - Compliance standards documentation
 * - Interactive security architecture visualization
 * - Responsive design with dark mode support
 * 
 * @module Pages
 */

import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';

/**
 * Interface for security feature cards
 * @interface SecurityFeature
 * @property {string} icon - Emoji or icon representation
 * @property {string} title - Feature name
 * @property {string} description - Brief feature description
 */
interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
}

/**
 * Interface for compliance standard cards
 * @interface ComplianceStandard
 * @property {string} name - Standard name (e.g., "GDPR", "CCPA")
 * @property {string} description - Brief overview of the standard
 * @property {string[]} features - Key compliance features
 */
interface ComplianceStandard {
  name: string;
  description: string;
  features: string[];
}

/**
 * SecurityFeatureCard Component
 * Displays individual security features in a consistent card format
 * 
 * @component
 * @param {SecurityFeature} props - Security feature properties
 */
const SecurityFeatureCard: React.FC<SecurityFeature> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <div className="text-3xl mr-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

/**
 * ComplianceCard Component
 * Displays compliance standards with their features
 * 
 * @component
 * @param {ComplianceStandard} props - Compliance standard properties
 */
const ComplianceCard: React.FC<ComplianceStandard> = ({ name, description, features }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{name}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
);

/**
 * SecureCommunicationsPage Component
 * Main page component for security features and compliance information
 * 
 * @component
 * @returns {JSX.Element} Rendered page component
 */
const SecureCommunicationsPage: React.FC = () => {
  // Security features data - extend or modify this array to update security features
  const securityFeatures: SecurityFeature[] = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description: "Military-grade AES-256 encryption for all communications and stored data."
    },
    {
      icon: "🔐",
      title: "Access Control",
      description: "Role-based access control with multi-factor authentication and session management."
    },
    {
      icon: "📝",
      title: "Audit Logging",
      description: "Comprehensive audit trails for all system activities and data access."
    },
    {
      icon: "🛡️",
      title: "Data Protection",
      description: "Advanced data protection measures including backup and disaster recovery."
    }
  ];

  // Compliance standards data - extend or modify this array to update compliance information
  const complianceStandards: ComplianceStandard[] = [
    {
      name: "NIST Cybersecurity Framework",
      description: "Adherence to the National Institute of Standards and Technology cybersecurity guidelines.",
      features: [
        "Risk assessment and management",
        "Access control implementation",
        "System monitoring and detection",
        "Incident response planning"
      ]
    },
    {
      name: "GDPR Compliance",
      description: "Full compliance with European Union's General Data Protection Regulation.",
      features: [
        "Data privacy by design",
        "Consent management",
        "Data portability",
        "Right to erasure"
      ]
    },
    {
      name: "CCPA Requirements",
      description: "California Consumer Privacy Act compliance for data protection.",
      features: [
        "Consumer data rights",
        "Opt-out mechanisms",
        "Data collection transparency",
        "Privacy policy compliance"
      ]
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Navigation breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Services', href: '/services' },
          { label: 'Scalable Conversations', href: '/services/scalable-conversations' },
          { label: 'Secure Communications', href: '/services/scalable-conversations/secure-communications' }
        ]} 
      />

      {/* Page header section */}
      <div className="text-center mb-12">
        <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
          Technical Deep-Dive
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
          Secure Communications
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Enterprise-grade security ensuring the confidentiality and integrity of constituent interactions
        </p>
      </div>

      {/* Security features grid section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {securityFeatures.map((feature, index) => (
          <SecurityFeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Security architecture section with visual timeline */}
      <div className="bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            Security Architecture
          </h2>
          <div className="space-y-8">
            {/* Application Layer */}
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Application Layer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure application architecture with input validation, output encoding, and session management.
              </p>
            </div>
            {/* Network Layer */}
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Network Layer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Multi-layered network security with firewalls, intrusion detection, and DDoS protection.
              </p>
            </div>
            {/* Data Layer */}
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Data Layer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Encryption at rest and in transit with secure key management and data isolation.
              </p>
            </div>
            {/* Physical Layer */}
            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-4 h-4 -ml-2 rounded-full bg-secondary"></div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Physical Layer</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure data centers with physical access controls and environmental protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance standards grid section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
          Compliance Standards
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {complianceStandards.map((standard, index) => (
            <ComplianceCard key={index} {...standard} />
          ))}
        </div>
      </div>

      {/* Security commitment section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Our Security Commitment
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          We maintain the highest standards of security to protect your constituent communications 
          and data. Our commitment includes:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Security commitment items with checkmark icons */}
          <div className="flex items-start">
            <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Regular security audits and penetration testing
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Continuous security monitoring and threat detection
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Regular security training for all team members
            </span>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-secondary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Incident response and disaster recovery planning
            </span>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Ready to Secure Your Constituent Communications?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Learn how our enterprise-grade security can protect your constituent interactions.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/contact"
            className="inline-block bg-secondary hover:bg-primary text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Schedule a Security Review
          </Link>
          <Link 
            href="/security-whitepaper"
            className="inline-block bg-white dark:bg-gray-800 text-secondary hover:text-primary border-2 border-secondary hover:border-primary font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Download Security Whitepaper
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecureCommunicationsPage;
