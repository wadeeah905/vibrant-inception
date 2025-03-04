
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
  overlay?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoUrl, 
  children, 
  overlay = "bg-rich-black/60" 
}) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <motion.video
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20 }}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </motion.video>
      <div className={`absolute inset-0 ${overlay} backdrop-blur-[2px]`} />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;
