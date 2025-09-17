import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  priority = false,
  fallback = null,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate responsive srcset for different formats and sizes
  const generateSrcSet = (baseSrc, format) => {
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(size => {
        const formatSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
        return `${formatSrc}?w=${size} ${size}w`;
      })
      .join(', ');
  };

  // Extract base path without extension
  const basePath = src?.replace(/\.(jpg|jpeg|png)$/i, '') || '';
  
  // Generate different format sources
  const avifSrcSet = generateSrcSet(src, 'avif');
  const webpSrcSet = generateSrcSet(src, 'webp');
  const fallbackSrcSet = generateSrcSet(src, src?.split('.').pop() || 'jpg');

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  if (imageError && fallback) {
    return fallback;
  }

  return (
    <div className={`optimized-image-container ${className}`}>
      {!imageLoaded && (
        <div className="image-placeholder" style={{ width, height }}>
          <div className="image-skeleton">
            <div className="skeleton-animation"></div>
          </div>
        </div>
      )}
      
      <picture>
        {/* AVIF format - best compression */}
        <source
          srcSet={avifSrcSet}
          sizes={sizes}
          type="image/avif"
        />
        
        {/* WebP format - good compression and wide support */}
        <source
          srcSet={webpSrcSet}
          sizes={sizes}
          type="image/webp"
        />
        
        {/* Fallback format */}
        <motion.img
          src={src}
          srcSet={fallbackSrcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`optimized-image ${imageLoaded ? 'loaded' : 'loading'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: width && height ? `${width} / ${height}` : 'auto'
          }}
          {...props}
        />
      </picture>
    </div>
  );
};

// Specific variants for common use cases
export const HeroImage = (props) => (
  <OptimizedImage
    {...props}
    priority={true}
    loading="eager"
    sizes="100vw"
    className={`hero-image ${props.className || ''}`}
  />
);

export const BlogImage = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
    className={`blog-image ${props.className || ''}`}
  />
);

export const ThumbnailImage = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
    className={`thumbnail-image ${props.className || ''}`}
  />
);

export const AvatarImage = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 768px) 80px, 120px"
    className={`avatar-image ${props.className || ''}`}
  />
);

export default OptimizedImage;
