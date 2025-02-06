
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import TextElementCard from "./TextElementCard";
import ImageCard from "./ImageCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DesignPreviewProps {
  design: any;
  onDownloadText: (text: any) => void;
  onDownloadImage: (imageUrl: string, imageName: string) => void;
}

const DesignPreview = ({ design, onDownloadText, onDownloadImage }: DesignPreviewProps) => {
  if (!design) return null;

  const textElements = design.textElements || [];
  const uploadedImages = design.uploadedImages || [];

  return (
    <Card className="p-6 mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Design - {design.faceId}
      </h3>
      
      <div className="aspect-video w-full relative rounded-lg overflow-hidden border mb-6 bg-white shadow-inner">
        <img 
          src={design.canvasImage} 
          alt={`Design ${design.faceId}`}
          className="w-full h-full object-contain"
        />
      </div>

      {textElements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
            <span className="p-1 rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </span>
            Éléments de texte
          </h4>
          <div className="grid gap-4">
            {textElements.map((text: any, index: number) => (
              <TextElementCard 
                key={index} 
                text={text} 
                onDownload={() => onDownloadText(text)}
              />
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div>
          <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
            <span className="p-1 rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </span>
            Images
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {uploadedImages.map((image: any, index: number) => (
              <ImageCard
                key={index}
                image={image}
                onDownload={onDownloadImage}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DesignPreview;
