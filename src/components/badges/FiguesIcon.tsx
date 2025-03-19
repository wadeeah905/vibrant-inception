
import React from 'react';
import { Badge } from 'lucide-react';

interface FiguesIconProps {
  size?: number;
  color?: string;
}

const FiguesIcon: React.FC<FiguesIconProps> = ({ 
  size = 24, 
  color = 'currentColor' 
}) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Badge size={size} color={color} />
      <span className="absolute text-[10px] font-bold" style={{ color }}>
        FD
      </span>
    </div>
  );
};

export default FiguesIcon;
