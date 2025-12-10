import React, { useState } from 'react';

export default function OptimizedImage({
  src,
  alt,
  className = '',
  fallback = 'https://via.placeholder.com/800x600?text=Image+Loading',
  loading = 'lazy',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Try to use WebP if available, fallback to original
  const getWebPSrc = (url) => {
    if (!url) return url;
    // If it's an Unsplash URL, we can request WebP format
    if (url.includes('unsplash.com')) {
      return url.replace(/&w=\d+/, '&w=1600&fm=webp&q=80');
    }
    // For other URLs, try to append WebP extension
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
      return url.replace(/\.(jpg|jpeg|png)/i, '.webp');
    }
    return url;
  };

  const webpSrc = getWebPSrc(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (imageSrc !== fallback) {
      // Try fallback
      setImageSrc(fallback);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${hasError ? 'opacity-50' : ''}`}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          {...props}
        />
      </picture>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <span className="text-slate-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

