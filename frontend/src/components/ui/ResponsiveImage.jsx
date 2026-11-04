import React, { useState } from 'react';

/**
 * Componente de Imagen Responsiva de Alto Rendimiento
 * - Garantiza CLS = 0 reservando dimensiones exactas o relación de aspecto (aspect-ratio)
 * - Genera srcset responsivo tanto para imágenes locales como de Unsplash
 * - Soporta fetchpriority="high" y loading="eager" para imágenes en el Hero (LCP)
 * - Soporta loading="lazy" y decoding="async" para imágenes bajo el primer pantallazo
 */
export const ResponsiveImage = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  aspectRatio = '4/5', // '4/5', '16/9', '1/1', etc.
  width,
  height,
  priority = false, // true para el primer banner del hero
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  objectFit = 'cover',
  fallbackPlaceholder = null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useSrcSet, setUseSrcSet] = useState(true);

  if (!src || hasError) {
    return (
      <div
        className={`bg-night-900/60 flex flex-col items-center justify-center text-text-muted text-xs p-3 text-center border border-night-800 ${containerClassName}`}
        style={{
          aspectRatio,
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined
        }}
      >
        <span className="text-gold-light/40 text-lg mb-1">✨</span>
        <span className="line-clamp-2 text-[11px] font-medium">
          {fallbackPlaceholder || alt || 'Sweet Home & Boutique'}
        </span>
      </div>
    );
  }

  const isUnsplash = src.includes('images.unsplash.com');
  const isLocalUpload = src.startsWith('/uploads/');

  let src480 = src;
  let src768 = src;
  let src1200 = src;
  let src1920 = src;
  let defaultSrc = src;

  if (isUnsplash) {
    const cleanBase = src.split('?')[0];
    const fitParam = objectFit === 'contain' ? 'fit=max' : 'fit=crop';
    src480 = `${cleanBase}?w=480&q=80&auto=format&${fitParam}`;
    src768 = `${cleanBase}?w=768&q=80&auto=format&${fitParam}`;
    src1200 = `${cleanBase}?w=1200&q=80&auto=format&${fitParam}`;
    src1920 = `${cleanBase}?w=1920&q=80&auto=format&${fitParam}`;
    defaultSrc = src1200;
  } else if (isLocalUpload) {
    const baseWithoutExt = src.replace(/\.[^.]+$/, '');
    src480 = `${baseWithoutExt}_480.webp`;
    src768 = `${baseWithoutExt}_768.webp`;
    src1200 = `${baseWithoutExt}_1200.webp`;
    src1920 = src;
    defaultSrc = src;
  }

  const srcSetWebp =
    isUnsplash || isLocalUpload
      ? `${src480} 480w, ${src768} 768w, ${src1200} 1200w, ${src1920} 1920w`
      : undefined;

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{
        aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined
      }}
    >
      {/* Placeholder sutil mientras carga para evitar parpadeos */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-night-800 animate-pulse pointer-events-none" />
      )}

      <img
        src={defaultSrc}
        srcSet={useSrcSet ? srcSetWebp : undefined}
        sizes={sizes}
        alt={alt}
        width={width || 600}
        height={height || 750}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (useSrcSet && isLocalUpload) {
            // Intentar cargar la URL directa sin variantes
            setUseSrcSet(false);
          } else {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full transition-opacity duration-300 ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};

export default ResponsiveImage;
