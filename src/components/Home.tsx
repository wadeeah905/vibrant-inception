
import { useState, useEffect } from 'react';
import Hero from './Hero';
import About from './About';
import Portfolio from './Portfolio';
import Services from './Services';
import Contact from './Contact';
import LoadingScreen from './LoadingScreen';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout for the loading screen
    console.log("Loading home component...");
    const timer = setTimeout(() => {
      console.log("Loading complete, showing content");
      setIsLoading(false);
    }, 2000);
    
    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while isLoading is true
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render main content once loading is complete
  return (
    <div className="bg-gray-900 min-h-screen">
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Contact />
    </div>
  );
};

export default Home;
