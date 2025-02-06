import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { products } from "@/config/productConfig";

interface ProductSideSelectorProps {
  sides: ProductSide[];
  activeSide: string;
  onSideSelect: (sideId: string) => void;
  selectedCategory: string;
}

interface ProductSide {
  id: string;
  title: string;
  description?: string;
}

const ProductSideSelector = ({ 
  sides, 
  activeSide, 
  onSideSelect,
  selectedCategory 
}: ProductSideSelectorProps) => {
  if (sides.length <= 1) return null;

  const selectedProduct = products.find(p => p.id === selectedCategory);
  const productFaces = selectedProduct?.faces || [];

  return (
    <Card className="p-3 bg-white shadow-sm mb-4">
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          {sides.map((side) => {
            const face = productFaces.find(f => f.id === side.id);
            return (
              <div 
                key={side.id} 
                className="flex flex-col items-center gap-2"
              >
                <div className="w-full h-[200px] overflow-hidden rounded-lg border border-gray-200 relative">
                  {face?.imageUrl ? (
                    <img
                      src={face.imageUrl}
                      alt={side.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No preview available</span>
                    </div>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeSide === side.id ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => onSideSelect(side.id)}
                        className={`min-w-[120px] transition-all ${
                          activeSide === side.id 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : ""
                        }`}
                      >
                        {side.title}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{side.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ProductSideSelector;