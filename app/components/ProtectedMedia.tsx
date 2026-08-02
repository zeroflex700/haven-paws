"use client";

import { cldOptimized } from "@/lib/cloudinary";

export function ProtectedImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative select-none ${className ?? ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cldOptimized(src, 1000)}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}

export function ProtectedVideo({
  src,
  className,
  autoPlay,
  muted,
  loop,
}: {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}) {
  return (
    <video
      src={src}
      controls={!autoPlay}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className={className}
    />
  );
}