
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  placeholder?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy',
  sizes = '100vw',
  placeholder = 'blur'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(priority ? src : null);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Preload image when src changes or priority is true
  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    
    // If priority is true, load immediately
    if (priority) {
      setImgSrc(src);
      return;
    }
    
    // Create a new image object to check if it's cached
    const cachedImage = new Image();
    cachedImage.src = src;
    
    if (cachedImage.complete) {
      setIsLoaded(true);
      setImgSrc(src);
      return;
    }
    
    // Use Intersection Observer for lazy loading
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImgSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading when image is within 200px of viewport
        threshold: 0.01
      }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
      observerRef.current = observer;
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    // Retry loading after a short delay
    setTimeout(() => {
      const timestamp = new Date().getTime();
      setImgSrc(`${src}?t=${timestamp}`);
    }, 1000);
  };

  const aspectRatioClass = width && height ? 'aspect-ratio' : '';
  const blurClass = !isLoaded && placeholder === 'blur' ? 'blur-sm' : '';

  const style: React.CSSProperties = {
    ...(width && typeof width === 'number' ? { width: `${width}px` } : width ? { width } : {}),
    ...(height && typeof height === 'number' ? { height: `${height}px` } : height ? { height } : {}),
    ...(width && height && typeof width === 'number' && typeof height === 'number' 
      ? { aspectRatio: `${width} / ${height}` } 
      : {})
  };

  return (
    <div 
      ref={imageRef}
      className={`${className} ${aspectRatioClass} overflow-hidden relative`} 
      style={style}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${blurClass}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes={sizes}
          style={style}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" style={style}></div>
      )}
    </div>
  );
};

export default OptimizedImage;
