import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { toast } from "sonner";
import { Canvas, Image as FabricImage } from "fabric";
import { productZoneConfigs } from "./config/zoneConfig";

interface ImageUploaderProps {
  canvas: Canvas | null;
  onImageUpload: (image: { id: string; url: string; name: string }) => void;
  selectedCategory: string | null;
}

const ImageUploader = ({ canvas, onImageUpload, selectedCategory }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner un produit d'abord");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (!canvas || !event.target.files?.[0]) return;

    const productZone = productZoneConfigs.find(zone => zone.id === selectedCategory);
    if (!productZone?.faces?.[0]?.zone) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      
      FabricImage.fromURL(e.target.result.toString(), {
        crossOrigin: 'anonymous',
      }).then((fabricImage) => {
        if (fabricImage && productZone.faces[0].zone) {
          fabricImage.scaleToWidth(150);
          fabricImage.set({
            left: productZone.faces[0].zone.left + productZone.faces[0].zone.width / 2,
            top: productZone.faces[0].zone.top + productZone.faces[0].zone.height / 2,
            originX: 'center',
            originY: 'center',
            cornerColor: 'rgba(102,153,255,0.5)',
            cornerSize: 12,
            transparentCorners: false,
            hasControls: true,
            hasBorders: true,
          });
          canvas.add(fabricImage);
          canvas.setActiveObject(fabricImage);
          canvas.renderAll();
          
          onImageUpload({
            id: Date.now().toString(),
            url: e.target.result as string,
            name: file.name
          });
        }
      }).catch(error => {
        console.error('Error loading image:', error);
        toast.error("Erreur lors du chargement de l'image");
      });
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Ajouter une Image</Label>
      <div className="flex flex-col gap-2">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          disabled={!selectedCategory}
        />
        <Button 
          onClick={() => {
            if (!selectedCategory) {
              toast.error("Veuillez sélectionner un produit d'abord");
              return;
            }
            fileInputRef.current?.click();
          }}
          className="w-full"
          variant="secondary"
          disabled={!selectedCategory}
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger une Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;