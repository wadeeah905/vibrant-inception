
import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import About from './About';
import Portfolio from './Portfolio';
import Services from './Services';
import Contact from './Contact';
import LoadingScreen from './LoadingScreen';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Contact />
    </>
  );
};

export default Home;
