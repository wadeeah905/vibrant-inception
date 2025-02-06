import { useEffect, useState } from 'react';
import { ArrowDown, Instagram, Facebook, Linkedin } from 'lucide-react';

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = ['#A7C6ED', '#C1A7F5', '#F5E56B', '#333333'];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: 'url("https://placehold.co/1920x1080")',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[90vh] items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="animate-fade-in font-sans text-5xl font-bold leading-tight md:text-7xl">
            L'Élégance<br />
            Professionnelle
          </h1>
          <p className="mt-6 animate-fade-in-delayed font-body text-xl md:text-2xl">
            Découvrez notre collection exclusive de tenues professionnelles
          </p>
          <a
            href="#products"
            className="group mt-8 inline-block animate-fade-in-delayed rounded-full bg-white px-8 py-4 font-sans font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
          >
            Explorer la Collection
          </a>
          
          {/* Scroll Down Arrow */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a 
          href="#instagram" 
          className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Instagram"
          style={{ color: colors[colorIndex] }}
        >
          <Instagram className="h-6 w-6" />
        </a>
        <a 
          href="#facebook" 
          className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Facebook"
          style={{ color: colors[colorIndex] }}
        >
          <Facebook className="h-6 w-6" />
        </a>
        <a 
          href="#linkedin" 
          className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="LinkedIn"
          style={{ color: colors[colorIndex] }}
        >
          <Linkedin className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
};