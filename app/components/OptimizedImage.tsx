"use client";

import Image from "next/image";
import { useState } from "react";

function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!src.includes("/upload/")) return src;

  return src.replace(
    "/upload/",
    `/upload/w_${width},q_${quality ?? "auto"},f_auto,c_limit/`
  );
}

function blurUrl(src: string): string | null {
  if (!src.includes("/upload/")) return null;

  return src.replace(
    "/upload/",
    "/upload/w_32,e_blur:1000,q_1,f_auto/"
  );
}

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

  const blur = blurUrl(src);

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : ""
      } ${containerClassName}`}
    >
      {blur && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blur}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
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
          loader={cloudinaryLoader}
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(false);
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}