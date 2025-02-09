import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Heart, ClipboardList, Search, PenLine, Trash2, MessageCircle } from "lucide-react";
import Footer from "./Footer";
import { Link, useNavigate } from 'react-router-dom';
import { products } from "@/config/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Article 1", price: "120 DT", image: "/placeholder.svg" },
    { id: 2, name: "Article 2", price: "85 DT", image: "/placeholder.svg" }
  ]);
  const navigate = useNavigate();

  const filteredProducts = searchQuery
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products.slice(0, 5); // Show first 5 products when no search query

  const handleCartClick = () => {
    console.log('Navigating to cart page');
    navigate('/cart');
  };

  const handleDevisClick = () => {
    navigate('/devis');
  };

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/+21600000000', '_blank');
  };

  const handleProductSelect = (productId: string) => {
    navigate('/personalization', { state: { selectedProduct: productId } });
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // ... keep existing code (WhatsApp Support Button and Top Navigation)

  return (
    <div className="min-h-screen flex flex-col">
      {/* WhatsApp Support Button */}
      <button
        onClick={handleWhatsAppSupport}
        className="fixed left-6 bottom-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        aria-label="Contact Support via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden md:inline text-sm font-medium">Support Technique</span>
      </button>

      {/* Top Navigation - Social Media Bar */}
      <div className="w-full bg-primary py-2 text-sm text-white">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Livraison gratuite à partir de 255 DT</span>
            <span className="sm:hidden">Livraison &gt; 255 DT</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
            </button>
            <Link to="/">
              <img src="/logo.png" alt="ELLES" className="ml-5 object-contain" style={{ height: "80px", width: "170px" }} />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:border-secondary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {filteredProducts.length > 0 ? (
                    <div className="py-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product.id)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <img 
                            src={product.image || "/placeholder.svg"} 
                            alt={product.name} 
                            className="w-12 h-12 object-contain"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">À partir de {product.startingPrice} DT</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-500">Aucun produit trouvé</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-primary hover:text-primary/80 focus:outline-none">
                <Heart className="h-6 w-6" />
                <span className="text-sm hidden md:inline">Mes favoris</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-primary border-b pb-2">
                    Mes Articles Favoris
                  </div>
                  {favorites.length > 0 ? (
                    <div className="space-y-3">
                      {favorites.map((item) => (
                        <DropdownMenuItem key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.price}</p>
                          </div>
                          <button className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </DropdownMenuItem>
                      ))}
                      <div className="pt-2 border-t">
                        <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                          Voir tous les favoris
                        </button>
                      </div>
                    </div>
                  ) : (
                    <DropdownMenuItem disabled className="text-center py-8 text-gray-500">
                      Aucun favori
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <button 
              onClick={handleDevisClick}
              className="flex items-center gap-1 text-primary hover:text-primary/80"
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-sm">Devis ({cartCount})</span>
            </button>
          </div>
        </div>

        <div className={`md:relative md:inset-auto md:flex md:w-auto md:transform-none md:justify-start md:bg-transparent  shadow-black/10 border-b border-gray-300 ${
          isMenuOpen ? "block" : "hidden"
        }`}>
          <div className="flex h-full flex-col items-start space-y-6 p-6 md:flex-row md:items-center md:space-y-0 md:space-x-12 md:p-0 md:pb-6 container mx-auto ">
            <div className="md:pl-16">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
                <Link to="/metiers" className="nav-link w-full pb-6 text-left text-gray-600 hover:text-primary md:w-auto md:pb-6">
                  MÉTIERS
                </Link>
                <Link to="/marques" className="nav-link w-full pb-6 text-left text-gray-600 hover:text-primary md:w-auto md:pb-6">
                  MARQUES
                </Link>
                <a href="#" className="nav-link w-full pb-6 text-left text-gray-600 hover:text-primary md:w-auto md:pb-6">
                  SAISON
                </a>
                <Link to="/personalization" className="nav-link w-full pb-6 text-left text-blue-500 flex items-center gap-2 md:w-auto md:pb-6">
                  <PenLine className="h-4 w-4" />
                  PERSONNALISATION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow" onClick={() => setShowSearchResults(false)}>
        {children}
      </main>

      <Footer />
    </div>
  );
};