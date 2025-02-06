import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "fabric";
import { toast } from "sonner";
import { productSidesConfigs } from "../config/productSidesConfig";
import { products } from "@/config/products";

interface DesignValidationHandlerProps {
  canvas: Canvas | null;
  selectedCategory: string | null;
  selectedSide: string;
}

export const DesignValidationHandler = ({
  canvas,
  selectedCategory,
  selectedSide
}: DesignValidationHandlerProps) => {
  const navigate = useNavigate();

  const hasCompletedAllSides = () => {
    if (!selectedCategory) return false;
    
    const productConfig = productSidesConfigs.find(config => config.id === selectedCategory);
    if (!productConfig) return false;

    const requiredSides = productConfig.sides;
    const completedDesigns = requiredSides.filter(side => {
      const designKey = `design-${selectedCategory}-${side.id}`;
      const savedDesign = localStorage.getItem(designKey);
      return savedDesign !== null;
    });

    return completedDesigns.length === requiredSides.length;
  };

  const handleValidateDesign = () => {
    if (!canvas || !selectedCategory) {
      toast.error("Veuillez d'abord créer un design");
      return;
    }

    // Get the product information
    const product = products.find(p => p.id === selectedCategory);
    if (!product) {
      toast.error("Produit non trouvé");
      return;
    }

    const textElements = canvas.getObjects('text').map((obj: any) => ({
      content: obj.text || '',
      font: obj.fontFamily || '',
      color: obj.fill?.toString() || '',
      size: obj.fontSize || 16,
      style: {
        bold: obj.fontWeight === 'bold',
        italic: obj.fontStyle === 'italic',
        underline: obj.underline || false,
        align: obj.textAlign || 'center'
      }
    }));

    const designData = {
      faceId: selectedSide,
      productId: selectedCategory,
      productName: product.name,
      canvasImage: canvas.toDataURL(),
      textElements,
      uploadedImages: canvas.getObjects('image').map((obj: any) => ({
        name: obj.name || 'image',
        url: obj._element?.src || ''
      }))
    };

    const designKey = `design-${selectedCategory}-${selectedSide}`;
    localStorage.setItem(designKey, JSON.stringify(designData));
    
    // Store the product name separately to ensure it's always available
    localStorage.setItem('selectedProductName', product.name);
    localStorage.setItem('selectedProductId', selectedCategory);
    
    navigate('/design-validation', { state: { designData } });
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleValidateDesign}
        className="w-full bg-green-500 hover:bg-green-600"
        size="lg"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Valider mon design
      </Button>
    </div>
  );
};