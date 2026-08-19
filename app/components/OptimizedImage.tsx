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

  /*
   * Keep existing Cloudinary URLs intact unless a size was
   * explicitly requested.
   *
   * This avoids double-transforming URLs and lets us verify
   * that the original assets are reachable again.
   */
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
  const [loaded, setLoaded] = useState(false);
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
          <div className="text-center px-4">
            <span className="block text-sage text-xs">
              Image unavailable
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={alt}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={() => {
              setLoaded(true);
              setFailed(false);
            }}
            onError={() => {
              setFailed(true);
              setLoaded(false);
            }}
            onContextMenu={(e) => e.preventDefault()}
            className={`${
              fill
                ? "absolute inset-0 w-full h-full"
                : "w-full h-auto"
            } object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            } ${className}`}
          />

          {failed && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-alt">
              <span className="px-4 text-center text-xs text-sage">
                Image unavailable
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}