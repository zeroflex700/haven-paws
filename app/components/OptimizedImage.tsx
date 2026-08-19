"use client";

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

function getImageUrl(
  src: string,
  width?: number,
  height?: number
): string {
  if (!src.includes("/upload/")) {
    return src;
  }

  if (!width && !height) {
    return src;
  }

  const transformations = [
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    width && height ? "c_fill" : "",
    "q_auto",
    "f_auto",
  ]
    .filter(Boolean)
    .join(",");

  return src.replace(
    "/upload/",
    `/upload/${transformations}/`
  );
}

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
  const [failed, setFailed] = useState(false);

  if (!src) {
    return (
      <div
        className={`w-full h-full bg-cream-alt flex items-center justify-center ${containerClassName}`}
      >
        <span className="text-sage text-xs">
          No image
        </span>
      </div>
    );
  }

  const imageUrl = getImageUrl(
    src,
    fill ? undefined : width,
    fill ? undefined : height
  );

  if (failed) {
    return (
      <div
        className={`relative overflow-hidden ${
          fill ? "w-full h-full" : ""
        } ${containerClassName}`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-cream-alt">
          <span className="px-4 text-center text-xs text-sage">
            Image unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : ""
      } ${containerClassName}`}
    >
      {/* Loading background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cream-alt"
      />

      {/* Actual image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onError={() => {
          setFailed(true);
        }}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative ${
          fill
            ? "absolute inset-0 w-full h-full"
            : "w-full h-auto"
        } object-cover ${className}`}
      />
    </div>
  );
}