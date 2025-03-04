import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
};

export default Home;