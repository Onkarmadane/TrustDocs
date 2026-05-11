import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable Image component inspired by Next.js.
 * Handles: Lazy loading, Shimmer placeholders, Error fallbacks, and Aspect Ratio.
 * Supports flexible sizing via width, height, or 'fill' prop.
 *
 * IMPORTANT: When using `fill`, the parent element MUST have `position: relative`
 * (or another positioned value) AND explicit dimensions. The component will warn
 * in development if this requirement is not met.
 */
const Image = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  containerClassName = '',
  placeholder = 'shimmer',
  objectFit = 'cover',
  priority = false,
  fallbackSrc = 'https://via.placeholder.com/400x300?text=Image+Not+Found',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Dev-mode safety check: warn if `fill` is used without a positioned parent
  useEffect(() => {
    if (fill && containerRef.current && process.env.NODE_ENV !== 'production') {
      const parent = containerRef.current.parentElement;
      if (parent) {
        const parentPosition = window.getComputedStyle(parent).position;
        if (parentPosition === 'static') {
          console.warn(
            `[Image] "fill" prop requires the parent element to have position: relative (or absolute/fixed/sticky). ` +
            `The parent currently has position: static. This will cause the image to escape its container. ` +
            `Add "relative" class or "position: relative" to the parent.`,
            parent
          );
        }
      }
    }
  }, [fill]);

  // Handle src changes and priority preloading
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    if (priority && src) {
      const img = new window.Image();
      img.src = src;
    }
  }, [priority, src]);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(e);
  };

  const finalSrc = hasError ? fallbackSrc : src;

  // Determine container styles based on fill prop
  // When fill is true, use inset: 0 which requires the parent to be positioned.
  // The container itself is relative + overflow-hidden, so inner content can never escape.
  const containerStyle = fill
    ? { position: 'absolute', inset: 0, overflow: 'hidden' }
    : {
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: !height && width ? 'auto' : undefined,
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      {/* Placeholder / Loader */}
      {isLoading && placeholder === 'shimmer' && (
        <div className="absolute inset-0 z-10 shimmer-wrapper rounded-[inherit]" />
      )}

      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 z-10 bg-slate-100 blur-sm rounded-[inherit] transition-opacity duration-500" />
      )}

      {/* Actual Image — max-width/height ensures it can never exceed container bounds */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        className={`
          w-full h-full transition-all duration-700 ease-in-out
          ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
          ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  placeholder: PropTypes.oneOf(['shimmer', 'blur', 'none']),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  priority: PropTypes.bool,
  fallbackSrc: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default Image;
