
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HeroVideoProps {
  thumbnailUrl: string;
  videoUrl: string;
  title?: string;
  description?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ thumbnailUrl, videoUrl, title, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement | null>(null);

  // Preload video on component mount
  useEffect(() => {
    // Create a hidden video element for preloading
    preloadVideoRef.current = document.createElement('video');
    preloadVideoRef.current.src = videoUrl;
    preloadVideoRef.current.preload = 'auto';
    
    // Clean up on unmount
    return () => {
      if (preloadVideoRef.current) {
        preloadVideoRef.current.src = '';
        preloadVideoRef.current = null;
      }
    };
  }, [videoUrl]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (previewVideoRef.current) {
      previewVideoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovered ? (
          <video
            ref={previewVideoRef}
            className="w-full h-full object-cover"
            src={videoUrl}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            {description && <p className="text-gray-200">{description}</p>}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden gold-glow"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={videoUrl}
                autoPlay
                playsInline
                loop
                preload="auto"
              />
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (videoRef.current) {
                    videoRef.current.pause();
                  }
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroVideo;
