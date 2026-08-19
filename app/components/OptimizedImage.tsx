"use client";

import Image from "next/image";
import { useState } from "react";

export type OptimizedImageProps = {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
};

export default function OptimizedImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes = "100vw",
  priority = false,
  className = "",
  containerClassName = "",
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src) {
    return (
      <div
        className={`w-full h-full bg-cream-alt flex items-center justify-center ${containerClassName}`}
      >
        <span className="text-sage text-xs">No image</span>
      </div>
    );
  }

  /*
   * IMPORTANT:
   *
   * These images are already hosted remotely (primarily Cloudinary).
   * Do not generate another Cloudinary transformation here.
   *
   * Serving the original URL avoids breaking existing assets when
   * Cloudinary transformation/security settings change.
   */
  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : ""
      } ${containerClassName}`}
    >
      {!loaded && !failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cream-alt animate-pulse"
        />
      )}

      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-alt">
          <span className="px-4 text-center text-xs text-sage">
            Image unavailable
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          unoptimized
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(false);
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}