import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Image as FabricImage, Point } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { productZoneConfigs } from "./config/zoneConfig";
import { productSidesConfigs } from "./config/productSidesConfig";
import ProductSideSelector from "./ProductSideSelector";
import { toast } from "sonner";
import { productSideImages } from "./config/productSideImagesConfig";
import FaceConfirmationDialog from "./FaceConfirmationDialog";
import { FaceDesign } from "./types/faceDesign";

interface CanvasContainerProps {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  isMobile: boolean;
  text: string;
  selectedFont: string;
  onObjectDelete: () => void;
  selectedCategory: string;
  selectedSide: string;
  onSideSelect: (sideId: string) => void;
}

const CanvasContainer = ({
  canvas,
  setCanvas,
  isMobile,
  text,
  selectedFont,
  onObjectDelete,
  selectedCategory,
  selectedSide,
  onSideSelect,
}: CanvasContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productConfig = productSidesConfigs.find((config) => config.id === selectedCategory);
  const zoneConfig = productZoneConfigs.find((config) => config.id === selectedCategory);
  const productImages = productSideImages.find(p => p.productId === selectedCategory)?.sides || [];
  const currentSideImage = productImages.find(img => img.sideId === selectedSide);
  const currentZone = zoneConfig?.faces.find(face => face.sideId === selectedSide)?.zone;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetSide, setTargetSide] = useState<string>("");
  const [outOfBoundsToastShown, setOutOfBoundsToastShown] = useState(false);

  const showOutOfBoundsToast = () => {
    if (!outOfBoundsToastShown) {
      toast.error("Veuillez placer le design dans les zones prédéfinies pour le produit", {
        position: "bottom-center",
        duration: 5000,
        onDismiss: () => setOutOfBoundsToastShown(false),
      });
      setOutOfBoundsToastShown(true);
      setTimeout(() => setOutOfBoundsToastShown(false), 5000);
    }
  };

  const enforceZoneBoundaries = (obj: any, currentZone: any) => {
    if (!obj || !currentZone) return;

    const objBounds = obj.getBoundingRect();
    const zoneLeft = currentZone.left;
    const zoneTop = currentZone.top;
    const zoneRight = zoneLeft + currentZone.width;
    const zoneBottom = zoneTop + currentZone.height;

    // Calculate object dimensions
    const objWidth = objBounds.width;
    const objHeight = objBounds.height;

    // Check if object is completely outside zone
    const isCompletelyOutside = 
      objBounds.left > zoneRight ||
      objBounds.top > zoneBottom ||
      objBounds.left + objWidth < zoneLeft ||
      objBounds.top + objHeight < zoneTop;

    if (isCompletelyOutside) {
      // Center the object in the zone
      const centerX = zoneLeft + (currentZone.width / 2);
      const centerY = zoneTop + (currentZone.height / 2);
      
      obj.setPositionByOrigin(
        new Point(centerX, centerY),
        'center',
        'center'
      );
      
      obj.setCoords();
      showOutOfBoundsToast();
      return;
    }

    // Handle boundary constraints with improved image handling
    let newLeft = obj.left;
    let newTop = obj.top;
    const isImage = obj.type === 'image';

    // Add a small buffer for images to prevent sticking
    const buffer = isImage ? 2 : 0;

    if (objBounds.left < zoneLeft + buffer) {
      newLeft = zoneLeft + buffer;
    }
    if (objBounds.top < zoneTop + buffer) {
      newTop = zoneTop + buffer;
    }
    if (objBounds.left + objWidth > zoneRight - buffer) {
      newLeft = zoneRight - objWidth - buffer;
    }
    if (objBounds.top + objHeight > zoneBottom - buffer) {
      newTop = zoneBottom - objHeight - buffer;
    }

    // Only update if position has significantly changed
    const hasSignificantChange = 
      Math.abs(newLeft - obj.left) > 0.5 || 
      Math.abs(newTop - obj.top) > 0.5;

    if (hasSignificantChange) {
      obj.set({
        left: newLeft,
        top: newTop
      });
      obj.setCoords();
      showOutOfBoundsToast();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate canvas size based on screen width while maintaining aspect ratio
    const containerWidth = isMobile ? window.innerWidth - 32 : 500; // 32px for padding
    const canvasSize = Math.min(containerWidth, 500); // Max size of 500px

    if (canvas) {
      canvas.dispose();
      setCanvas(null);
    }

    const newCanvas = new Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    // Scale zone configuration based on canvas size
    const scaleFactor = canvasSize / 500; // 500 is our base size

    // Add event listener for object movement with debounced boundary check
    let animationFrameId: number;
    newCanvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj || !currentZone) return;
      
      // Scale the zone based on canvas size
      const scaledZone = {
        ...currentZone,
        left: currentZone.left * scaleFactor,
        top: currentZone.top * scaleFactor,
        width: currentZone.width * scaleFactor,
        height: currentZone.height * scaleFactor,
      };
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        enforceZoneBoundaries(obj, scaledZone);
        newCanvas.renderAll();
      });
    });

    // Add event listener for object scaling
    newCanvas.on('object:scaling', (e) => {
      const obj = e.target;
      if (!obj || !currentZone) return;
      
      const objBounds = obj.getBoundingRect();
      const zoneLeft = currentZone.left;
      const zoneTop = currentZone.top;
      const zoneRight = zoneLeft + currentZone.width;
      const zoneBottom = zoneTop + currentZone.height;

      // Check if scaled object exceeds zone boundaries
      if (objBounds.left < zoneLeft ||
          objBounds.top < zoneTop ||
          objBounds.left + objBounds.width > zoneRight ||
          objBounds.top + objBounds.height > zoneBottom) {
        showOutOfBoundsToast();
        obj.scaleX = obj.lastScaleX || obj.scaleX;
        obj.scaleY = obj.lastScaleY || obj.scaleY;
        obj.setCoords();
      } else {
        obj.lastScaleX = obj.scaleX;
        obj.lastScaleY = obj.scaleY;
      }
    });

    // Add event listener for object added
    newCanvas.on('object:added', (e) => {
      const obj = e.target;
      if (!obj || !currentZone) return;
      
      // Use requestAnimationFrame to smooth out initial positioning
      requestAnimationFrame(() => {
        enforceZoneBoundaries(obj, currentZone);
        newCanvas.renderAll();
      });
    });

    // Add background image if available
    if (currentSideImage?.imageUrl) {
      FabricImage.fromURL(currentSideImage.imageUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        img.scaleToWidth(newCanvas.width!);
        img.scaleToHeight(newCanvas.height!);
        img.set({
          selectable: false,
          evented: false,
        });
        newCanvas.backgroundImage = img;
        
        // Add customization zone after background image is loaded
        if (currentZone) {
          const scaledZone = {
            ...currentZone,
            left: currentZone.left * scaleFactor,
            top: currentZone.top * scaleFactor,
            width: currentZone.width * scaleFactor,
            height: currentZone.height * scaleFactor,
          };

          const zone = new Rect({
            left: scaledZone.left,
            top: scaledZone.top,
            width: scaledZone.width,
            height: scaledZone.height,
            fill: currentZone.backgroundColor,
            stroke: currentZone.borderColor,
            strokeWidth: currentZone.borderWidth,
            strokeDashArray: [6, 6],
            selectable: false,
            evented: false,
          });
          newCanvas.add(zone);
          newCanvas.renderAll();
        }
      });
    }

    setCanvas(newCanvas);
    toast.success("Zone de personnalisation prête !");

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      newCanvas.dispose();
    };
  }, [selectedCategory, selectedSide, isMobile]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      onObjectDelete();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onObjectDelete]);

  const handleSideSelect = (newSide: string) => {
    if (!canvas) {
      onSideSelect(newSide);
      return;
    }

    // Get all objects except background and zone
    const contentObjects = canvas.getObjects().filter(obj => {
      const isBackground = obj === canvas.backgroundImage;
      const isZone = obj.type === 'rect' && !obj.selectable && !obj.evented;
      return !isBackground && !isZone;
    });

    // Only show confirmation if there are actual content objects
    if (contentObjects.length > 0) {
      setTargetSide(newSide);
      setShowConfirmation(true);
    } else {
      onSideSelect(newSide);
    }
  };

  const handleConfirmSideSwitch = () => {
    if (!canvas) return;

    // Save current face design
    const currentDesign: FaceDesign = {
      faceId: selectedSide,
      canvasImage: canvas.toDataURL(),
      textElements: canvas.getObjects('text').map((obj: any) => ({
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
      })),
      uploadedImages: canvas.getObjects('image').map((obj: any) => ({
        name: obj.name || 'image',
        url: obj._element?.src || ''
      }))
    };

    // Store in localStorage
    const designKey = `design-${selectedCategory}-${selectedSide}`;
    localStorage.setItem(designKey, JSON.stringify(currentDesign));

    // Clear canvas and switch sides
    canvas.clear();
    canvas.renderAll();
    onSideSelect(targetSide);
    setShowConfirmation(false);
    toast.success(`Design de la ${selectedSide} sauvegardé !`);
  };

  return (
    <div className="space-y-4">
      <ProductSideSelector
        sides={productConfig?.sides || []}
        activeSide={selectedSide}
        onSideSelect={handleSideSelect}
        selectedCategory={selectedCategory}
      />
      <Card className="p-4 relative">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onObjectDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Card>

      <FaceConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        currentFace={selectedSide}
        targetFace={targetSide}
        onConfirm={handleConfirmSideSwitch}
      />
    </div>
  );
};

export default CanvasContainer;