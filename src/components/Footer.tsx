const Footer = () => {
  return (
    <footer className="py-8 bg-primary text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">© 2024 Your Company. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;