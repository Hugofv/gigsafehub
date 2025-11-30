'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  fallback?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  fallback = '/placeholder.png',
}) => {
  const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src));
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    const normalizedFallback = normalizeImageUrl(fallback);
    if (imgSrc !== normalizedFallback) {
      setImgSrc(normalizedFallback);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-slate-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  );
};

export default ImageWithFallback;

