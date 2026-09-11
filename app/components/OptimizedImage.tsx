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

const FILL_BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1600];

function isCloudinaryUrl(src: string): boolean {
  return src.includes("/upload/");
}

function cloudinaryTransform(
  src: string,
  transformation: string
): string {
  return src.replace(
    "/upload/",
    `/upload/${transformation}/`
  );
}

/**
 * For fill-mode images (the vast majority — card grids, hero images,
 * anything sized by its CSS container rather than fixed pixels), we
 * can't know the exact rendered width ahead of time. So instead of
 * skipping optimization entirely (the previous bug — this served full
 * resolution originals for every fill image on the site), generate a
 * real srcSet across common breakpoints and let the browser pick the
 * right one, matched against the `sizes` prop the caller provides.
 */
function buildFillSources(src: string): {
  src: string;
  srcSet: string;
} {
  if (!isCloudinaryUrl(src)) {
    return { src, srcSet: "" };
  }

  const srcSet = FILL_BREAKPOINTS.map(
    (w) =>
      `${cloudinaryTransform(
        src,
        `w_${w},q_auto,f_auto`
      )} ${w}w`
  ).join(", ");

  // Reasonable mid-size fallback for browsers/contexts that ignore srcSet.
  const fallbackSrc = cloudinaryTransform(
    src,
    "w_800,q_auto,f_auto"
  );

  return { src: fallbackSrc, srcSet };
}

/**
 * For fixed-size images (explicit width/height passed), optimize to
 * that exact size plus a 2x variant for retina screens.
 */
function buildFixedSources(
  src: string,
  width: number,
  height?: number
): { src: string; srcSet: string } {
  if (!isCloudinaryUrl(src)) {
    return { src, srcSet: "" };
  }

  const baseTransform = height
    ? `w_${width},h_${height},c_fill,q_auto,f_auto`
    : `w_${width},q_auto,f_auto`;

  const retinaTransform = height
    ? `w_${width * 2},h_${height * 2},c_fill,q_auto,f_auto`
    : `w_${width * 2},q_auto,f_auto`;

  const baseSrc = cloudinaryTransform(src, baseTransform);
  const retinaSrc = cloudinaryTransform(src, retinaTransform);

  return {
    src: baseSrc,
    srcSet: `${baseSrc} 1x, ${retinaSrc} 2x`,
  };
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

  const { src: imageUrl, srcSet } = fill
    ? buildFillSources(src)
    : buildFixedSources(src, width ?? 800, height);

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
        srcSet={srcSet || undefined}
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
