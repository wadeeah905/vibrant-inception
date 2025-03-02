
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
    <div className="relative bg-gray-900 min-h-screen">
      {/* Background grid pattern for depth */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      
      {/* Content sections */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
