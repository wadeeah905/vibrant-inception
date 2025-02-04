import { Code, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: <Code className="h-8 w-8" />,
    title: "Modern Development",
    description: "Built with the latest React features and best practices",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Beautiful Design",
    description: "Stunning UI components and responsive layouts",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Optimized performance for the best user experience",
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-secondary hover:shadow-lg transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;