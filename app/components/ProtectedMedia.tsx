"use client";

import Image from "next/image";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProtectedImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: ProtectedImageProps) {
  if (!src) return null;

  return (
    <div
      className={`relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className="object-cover pointer-events-none"
        style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
      />
    </div>
  );
}

interface ProtectedVideoProps {
  src: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function ProtectedVideo({
  src,
  className = "",
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
}: ProtectedVideoProps) {
  if (!src) return null;

  return (
    <video
      src={src}
      poster={poster}
      className={`select-none ${className}`}
      controls
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      playsInline
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
    />
  );
}