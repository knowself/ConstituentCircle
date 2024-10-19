import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </>
  );
};

export default Home;
