"use client";

import OptimizedImage from "./OptimizedImage";

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
      className={`relative overflow-hidden select-none ${
        className ?? ""
      }`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        containerClassName="absolute inset-0"
      />
    </div>
  );
}

export function ProtectedVideo({
  src,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
}: {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden select-none ${
        className ?? ""
      }`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        src={src}
        controls={!autoPlay}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none"
      />
    </div>
  );
}