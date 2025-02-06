
import { FaceDesign } from "@/components/personalization/types/faceDesign";
import DesignPreview from "@/components/personalization/validation/DesignPreview";

interface DesignPreviewListProps {
  designs: { [key: string]: FaceDesign };
  onDownloadText: (text: any) => void;
  onDownloadImage: (imageUrl: string, imageName: string) => void;
}

const DesignPreviewList = ({ designs, onDownloadText, onDownloadImage }: DesignPreviewListProps) => {
  // Sort designs to ensure 'front' appears first
  const sortedDesigns = Object.entries(designs).sort(([keyA], [keyB]) => {
    if (keyA.includes('front')) return -1;
    if (keyB.includes('front')) return 1;
    return 0;
  });

  return (
    <div className="w-full space-y-6">
      {sortedDesigns.map(([key, design]) => (
        <DesignPreview
          key={key}
          design={design}
          onDownloadText={onDownloadText}
          onDownloadImage={onDownloadImage}
        />
      ))}
    </div>
  );
};

export default DesignPreviewList;
