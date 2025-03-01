
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProductCategory } from "../types";

// Define types
interface SubMenuItem {
  label: string;
  href: string;
  category: ProductCategory;
}

interface MenuItem {
  label: string;
  items: SubMenuItem[];
}

// Define the menu structure
const MENU_ITEMS: MenuItem[] = [
  {
    label: "Dattes",
    items: [
      { label: "Coffret Cadeaux", href: "products", category: "coffret-cadeaux" },
      { label: "Paquets", href: "products", category: "paquets" },
      { label: "Dattes en Vrac", href: "products", category: "dattes-en-vrac" }
    ]
  },
  {
    label: "Figues Séchées",
    items: [
      { label: "Coffrets en Bois", href: "products", category: "coffrets-en-bois" },
      { label: "Figues Séchées à l'Huile d'Olive", href: "products", category: "figues-sechees-huile-olive" },
      { label: "Figues Séchées en Vrac", href: "products", category: "figues-sechees-en-vrac" }
    ]
  },
  {
    label: "Sirops de Fruits",
    items: [
      { label: "Sirop de Dattes", href: "products", category: "sirop-dattes" },
      { label: "Sirop de Figues Séchées", href: "products", category: "sirop-figues" }
    ]
  },
  {
    label: "Sucre de Dattes",
    items: [
      { label: "Sucre de Dattes", href: "products", category: "sucre-dattes" }
    ]
  }
];

interface ProductsDropdownProps {
  onPageChange: (page: string, category?: ProductCategory) => void;
}

const ProductsDropdown = ({ onPageChange }: ProductsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (href: string, category: ProductCategory, e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(href, category);
    setIsOpen(false);
  };

  // Handle mouse enter for the main dropdown
  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  // Handle mouse leave for the main dropdown with a delay
  const handleDropdownLeave = () => {
    // Add a significant delay before closing the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
    }, 300); // 300ms delay before closing
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any lingering timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      onMouseEnter={handleDropdownEnter}
      onMouseLeave={handleDropdownLeave}
    >
      {/* Main Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#96cc39] transition-colors"
      >
        Produits
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Main Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
          {MENU_ITEMS.map((item) => (
            <div 
              key={item.label} 
              className="relative group"
              onMouseEnter={() => setActiveSubmenu(item.label)}
            >
              {/* Main Category Item */}
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39]">
                <ChevronRight className="w-4 h-4 mr-2" />
                {item.label}
              </button>

              {/* Submenu - Appears Aligned to the Right */}
              {activeSubmenu === item.label && (
                <div 
                  className="absolute top-0 left-full ml-0 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  style={{ marginLeft: '1px' }} // Ensure there's no gap between menus
                >
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      href="#"
                      onClick={(e) => handleClick(subItem.href, subItem.category, e)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39]"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsDropdown;
