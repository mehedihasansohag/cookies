
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPlans from '@/components/home/FeaturedPlans';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedPlans />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
