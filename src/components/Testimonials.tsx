const testimonials = [
  {
    quote: "This is exactly what our team has been looking for. Highly recommended!",
    author: "Sarah Johnson",
    role: "Product Manager",
  },
  {
    quote: "The best solution I've found in the market. Simple yet powerful.",
    author: "Michael Chen",
    role: "Developer",
  },
];

const Testimonials = () => {
  return (
    <div className="py-24 bg-secondary">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">
          What People Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-lg text-gray-600 mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;