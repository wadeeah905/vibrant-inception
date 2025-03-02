
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Navbarblog from './Navbarblog';
import ChatAssistant from './ChatAssistant';

const BlogLayout = () => {
  const location = useLocation();
  
  console.log("Current location:", location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {location.pathname === '/' ? <Navbar /> : <Navbarblog />}
        <Outlet />
        <ChatAssistant />
      </div>
    </div>
  );
};

export default BlogLayout;
