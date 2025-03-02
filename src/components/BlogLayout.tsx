
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Navbarblog from './Navbarblog';
import ChatAssistant from './ChatAssistant';

const BlogLayout = () => {
  const location = useLocation();
  
  console.log("Current location:", location.pathname);

  return (
    <div className="min-h-screen bg-gray-900">
      {location.pathname === '/' ? <Navbar /> : <Navbarblog />}
      <Outlet />
      <ChatAssistant />
    </div>
  );
};

export default BlogLayout;
