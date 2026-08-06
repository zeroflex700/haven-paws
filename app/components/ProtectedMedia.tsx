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
  return <OptimizedImage src={src} alt={alt} fill containerClassName={className} />;
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