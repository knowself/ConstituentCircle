import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';

const Home: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </Layout>
  );
};

export default Home;
