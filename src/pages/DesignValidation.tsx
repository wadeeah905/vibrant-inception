import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, FileDown } from "lucide-react";
import { useCartStore } from "@/components/cart/CartProvider";
import { toast } from "sonner";
import { products } from "@/config/products";
import ValidationSidebar from "@/components/personalization/validation/ValidationSidebar";
import { useState, useEffect } from "react";
import { FaceDesign } from "@/components/personalization/types/faceDesign";
import DesignPreviewList from "@/components/design-validation/DesignPreviewList";
import CustomizationOptions from "@/components/design-validation/CustomizationOptions";
import { generateDesignPDF } from "@/utils/pdfGenerator";
import { Canvas } from "fabric";
import { useDesignState } from "@/components/personalization/hooks/useDesignState";

const sizeOptions = [
  {
    value: "XS",
    label: "XS - Très Petit",
    description: "Tour de poitrine: 81-86cm, Tour de taille: 61-66cm"
  },
  {
    value: "S",
    label: "S - Petit",
    description: "Tour de poitrine: 86-91cm, Tour de taille: 66-71cm"
  },
  {
    value: "M",
    label: "M - Moyen",
    description: "Tour de poitrine: 91-97cm, Tour de taille: 71-76cm"
  },
  {
    value: "L",
    label: "L - Large",
    description: "Tour de poitrine: 97-102cm, Tour de taille: 76-81cm"
  },
  {
    value: "XL",
    label: "XL - Très Large",
    description: "Tour de poitrine: 102-107cm, Tour de taille: 81-86cm"
  },
  {
    value: "XXL",
    label: "XXL - Extra Large",
    description: "Tour de poitrine: 107-112cm, Tour de taille: 86-91cm"
  }
];

const DesignValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [cachedDesigns, setCachedDesigns] = useState<{ [key: string]: FaceDesign } | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [sizeQuantities, setSizeQuantities] = useState<{ [size: string]: number }>({});
  const [totalQuantity, setTotalQuantity] = useState(0);
  const designData = location.state?.designData;

  const {
    setText,
    setActiveText,
    setUploadedImages,
    setContentItems
  } = useDesignState();

  // Get the product information from localStorage or designData
  const storedProductName = localStorage.getItem('selectedProductName');
  const storedProductId = localStorage.getItem('selectedProductId');
  const currentProductId = storedProductId || designData?.productId;
  const currentProduct = products.find(p => p.id === currentProductId);
  const currentProductName = storedProductName || designData?.productName || currentProduct?.name || 'Produit non trouvé';

  useEffect(() => {
    const designs: { [key: string]: FaceDesign } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('design-')) {
        const value = localStorage.getItem(key);
        if (value) {
          designs[key] = JSON.parse(value);
        }
      }
    }
    setCachedDesigns(designs);
  }, []);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 999) {
      setQuantity(value);
    } else {
      toast.error("La quantité doit être comprise entre 1 et 999");
    }
  };

  const handleRequestQuote = () => {
    if (quantity < 1) {
      toast.error("La quantité minimum est de 1");
      return;
    }

    const allDesigns = getAllSavedDesigns();
    
    navigate('/devis', {
      state: {
        designs: allDesigns,
        productName: currentProductName,
        productId: currentProductId,
        selectedSize,
        quantity,
        designNumber: 1
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getAllSavedDesigns = () => {
    const designs: { [key: string]: FaceDesign } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('design-')) {
        const value = localStorage.getItem(key);
        if (value) {
          designs[key] = JSON.parse(value);
        }
      }
    }
    return designs;
  };

  const handleDownloadText = (text: any) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - 10x larger than the actual size
    canvas.width = 1000;
    canvas.height = 200;

    // Set text properties with 10x larger size
    ctx.fillStyle = text.color;
    const fontWeight = text.style.bold ? 'bold' : 'normal';
    const fontStyle = text.style.italic ? 'italic' : 'normal';
    ctx.font = `${fontWeight} ${fontStyle} ${text.size * 10}px ${text.font}`;
    ctx.textAlign = text.style.align as CanvasTextAlign;
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText(text.content, canvas.width / 2, canvas.height / 2);
    if (text.style.underline) {
      const textMetrics = ctx.measureText(text.content);
      const xStart = (canvas.width - textMetrics.width) / 2;
      ctx.beginPath();
      ctx.moveTo(xStart, canvas.height / 2 + text.size * 5);
      ctx.lineTo(xStart + textMetrics.width, canvas.height / 2 + text.size * 5);
      ctx.strokeStyle = text.color;
      ctx.lineWidth = text.size / 2;
      ctx.stroke();
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `text-preview-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success("Aperçu du texte téléchargé !");
  };

  const handleDownloadImage = (imageUrl: string, imageName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${imageName}-${Date.now()}.png`;
    link.click();
    toast.success("Image téléchargée !");
  };

  const handleDownloadPDF = async () => {
    toast.promise(
      generateDesignPDF(cachedDesigns || getAllSavedDesigns(), selectedSize, quantity),
      {
        loading: "Génération du PDF en cours...",
        success: "PDF téléchargé avec succès !",
        error: "Erreur lors de la génération du PDF",
      }
    );
  };

  const handleClearDesigns = () => {
    if (!canvas) return;
    
    // Store the background image before clearing
    const backgroundImage = canvas.backgroundImage;
    
    // Clear all objects except background
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj !== backgroundImage) {
        canvas.remove(obj);
      }
    });
    
    // Restore background image if it exists
    if (backgroundImage) {
      canvas.backgroundImage = backgroundImage;
      canvas.renderAll();
    }
    
    // Clear localStorage designs
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('design-')) {
        localStorage.removeItem(key);
      }
    });
    
    setText('');
    setActiveText(null);
    setUploadedImages([]);
    setContentItems([]);
    canvas.renderAll();
    toast.success("Design précédent effacé !");
  };

  if (!designData && !cachedDesigns) {
    navigate('/personalization');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Validation de votre design
            </h1>
          </div>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="gap-2 hover:bg-primary/5"
          >
            <FileDown className="h-4 w-4" />
            Télécharger les spécifications
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <DesignPreviewList
              designs={cachedDesigns || getAllSavedDesigns()}
              onDownloadText={handleDownloadText}
              onDownloadImage={handleDownloadImage}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <CustomizationOptions
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                sizeOptions={sizeOptions}
              />
              
              <ValidationSidebar
                product={currentProduct}
                onRequestQuote={handleRequestQuote}
                designData={designData || cachedDesigns}
                sizeQuantities={sizeQuantities}
                totalQuantity={totalQuantity}
                selectedSize={selectedSize}
                quantity={quantity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignValidation;
