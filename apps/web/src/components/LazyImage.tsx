'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-slate-200 flex items-center justify-center ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-slate-400 text-xs">Image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        <Image
          src={normalizeImageUrl(src)}
          alt={alt}
          fill
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
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
        src={normalizeImageUrl(src)}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  );
};

export default LazyImage;

