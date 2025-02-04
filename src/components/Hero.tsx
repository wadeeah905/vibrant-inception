import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Build Something Amazing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful web applications with React and modern tools. Start your journey today.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;