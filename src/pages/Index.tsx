
// Removing unused React import since it's not needed with modern JSX transform
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Vilart</h1>
        <Link to="/home" className="text-blue-500 hover:text-blue-600">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Index;
