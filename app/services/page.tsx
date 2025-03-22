'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

/**
 * Feature interface defining the structure of each feature card
 */
interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

/**
 * TechnicalService interface defining the structure of each technical service card
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
 */
const FeatureCard = ({ icon, title, description, link }: Feature) => (
  <div className="bg-background dark:bg-background/90 rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-3 text-foreground">{title}</h3>
    <p className="text-foreground/80 mb-4">{description}</p>
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
 */
const TechnicalServiceCard = ({ icon, title, description, link, techDetails, features, benefits }: TechnicalService) => (
  <div className="bg-background dark:bg-background/90 rounded-lg shadow-md p-6 flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-start mb-4">
      <div className="text-5xl mr-4">{icon}</div>
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
    
    {techDetails && (
      <div className="mb-4">
        <h4 className="font-semibold text-lg mb-2 text-foreground">Technical Details</h4>
        <p className="text-foreground/80">{techDetails}</p>
      </div>
    )}
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <h4 className="font-semibold text-lg mb-2 text-foreground">Key Features</h4>
        <ul className="list-disc list-inside text-foreground/80">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold text-lg mb-2 text-foreground">Benefits</h4>
        <ul className="list-disc list-inside text-foreground/80">
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <Link 
      href={link}
      className="mt-auto text-secondary hover:text-primary transition-colors duration-200 font-semibold self-start"
    >
      Learn More →
    </Link>
  </div>
);

/**
 * ServicesPage Component
 * Main page component that organizes and displays all service offerings
 */
export default function ServicesPage() {
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
      techDetails: "Built on zero-trust architecture with end-to-end encryption",
      features: [
        "End-to-end encryption for all communications",
        "Role-based access controls",
        "Comprehensive audit logging",
        "Compliance with government security standards"
      ],
      benefits: [
        "Protect sensitive constituent information",
        "Maintain regulatory compliance",
        "Build trust with constituents",
        "Prevent data breaches and unauthorized access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground">Our Technical Services</h1>
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Our Technical Services
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Cutting-edge solutions designed to revolutionize constituent engagement through 
            AI-powered communication technologies and data-driven insights.
          </p>
        </div>
        
        {/* Main Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>
        
        {/* Technical Services Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
            Technical Deep-Dives
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {technicalServices.map((service, index) => (
              <TechnicalServiceCard key={index} {...service} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
