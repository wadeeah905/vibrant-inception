import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/config/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";

interface ProductGridProps {
  onAddToCart: () => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const categories = ["all", ...new Set(products.map(product => product.name))];
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.name === selectedCategory);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: isMobile ? 2 : 4,
          dragFree: true
        }}
        plugins={[plugin]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {filteredProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/4 basis-1/2">
              <div 
                className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer h-full"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image || "https://placehold.co/800x800"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-xs text-gray-500">{product.name}</div>
                  <h3 className="font-sans text-lg font-medium text-primary">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">À partir de {product.startingPrice} TND</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart();
                      }}
                      className="rounded-full bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/90"
                    >
                      Personnaliser
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductGrid;