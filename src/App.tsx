
import { useState, useEffect } from 'react';
import { PreloadingScreen } from './components/PreloadingScreen';
import { ClientTypeModal } from './components/ClientTypeModal';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { Contact } from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import Revendeurs from './pages/Revendeurs';
import Certifications from './pages/Certifications';
import Products from './pages/Products';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import CertificationBadge from './components/CertificationBadge';
import type { ClientType, ProductCategory } from './types';
import Cookies from 'js-cookie';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientType, setClientType] = useState<ClientType>(() => {
    // Try to get client type from cookies
    const savedType = Cookies.get('clientType') as ClientType;
    return savedType || null;
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('tous');

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for navigation events from Products page
  useEffect(() => {
    const handleNavigateEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ page: string }>;
      if (customEvent.detail && customEvent.detail.page) {
        setCurrentPage(customEvent.detail.page);
      }
    };

    window.addEventListener('navigateTo', handleNavigateEvent);
    return () => {
      window.removeEventListener('navigateTo', handleNavigateEvent);
    };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    if (type) {
      // Save client type preference if cookies are accepted
      const hasConsent = Cookies.get('cookieConsent');
      if (hasConsent === 'accepted') {
        Cookies.set('clientType', type);
      }
    }
  };

  const handleCookieAccept = () => {
    // If user has already selected a client type, save it
    if (clientType) {
      Cookies.set('clientType', clientType);
    }
  };

  const handleCookieDecline = () => {
    // Remove any existing cookies
    Cookies.remove('clientType');
  };

  const handlePageChange = (page: string, category?: ProductCategory) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
  };

  if (isLoading) {
    return <PreloadingScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Products selectedCategory={selectedCategory} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'resellers':
        return <Revendeurs />;
      case 'certifications':
        return <Certifications />;
      default:
        return <Home clientType={clientType} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {clientType === null ? (
        <ClientTypeModal onSelect={handleClientTypeChange} />
      ) : (
        <>
          <Navbar 
            clientType={clientType} 
            onPageChange={handlePageChange}
            currentPage={currentPage}
            onClientTypeChange={handleClientTypeChange}
          />
          {renderPage()}
          <Footer />
          <ScrollToTop />
          <CertificationBadge />
          <CookieConsent 
            onAccept={handleCookieAccept}
            onDecline={handleCookieDecline}
          />
        </>
      )}
    </div>
  );
}

export default App;
