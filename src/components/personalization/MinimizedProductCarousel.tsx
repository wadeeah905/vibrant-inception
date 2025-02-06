import { ProductConfig } from "@/config/products";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MinimizedProductCarouselProps {
  products: ProductConfig[];
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
}

const MinimizedProductCarousel = ({
  products,
  selectedProduct,
  onProductSelect,
}: MinimizedProductCarouselProps) => {
  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
            slides: {
              perView: 4,
              spacing: 16,
            } as any, // Type assertion to fix the error
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/4">
                <div
                  onClick={() => onProductSelect(product.id)}
                  className={cn(
                    "cursor-pointer rounded-lg overflow-hidden border transition-all duration-300",
                    selectedProduct === product.id
                      ? "border-primary shadow-lg"
                      : "border-gray-200 hover:border-primary/50"
                  )}
                >
                  <div className="h-[120px] overflow-hidden">
                    <img
                      src={product.image || "https://placehold.co/800x800"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-primary mt-1">
                      À partir de {product.startingPrice} TND
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};

export default MinimizedProductCarousel;