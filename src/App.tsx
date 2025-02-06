import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageWrapper from './components/PageWrapper';
import Index from './pages/Index';
import Cart from './pages/Cart';
import Devis from './pages/Devis';
import Metiers from './pages/Metiers';
import Marques from './pages/Marques';
import Personalization from './pages/Personalization';
import DesignValidation from './pages/DesignValidation';
import DesignSummary from './pages/DesignSummary';

function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/metiers" element={<Metiers />} />
          <Route path="/marques" element={<Marques />} />
          <Route path="/personalization" element={<Personalization />} />
          <Route path="/design-validation" element={<DesignValidation />} />
          <Route path="/design-summary" element={<DesignSummary />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;