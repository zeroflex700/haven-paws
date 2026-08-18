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
<OptimizedImage
src={src}
alt={alt}
fill
containerClassName={className}
/>
);
}

export function ProtectedVideo({
src,
className,
autoPlay = false,
muted = false,
loop = false,
poster,
}: {
src: string;
className?: string;
autoPlay?: boolean;
muted?: boolean;
loop?: boolean;
poster?: string;
}) {
return (
<div
className={"relative overflow-hidden select-none ${className ?? ""}"}
onContextMenu={(e) => e.preventDefault()}
>
<video
src={src}
poster={poster}
autoPlay={autoPlay}
muted={muted}
loop={loop}
playsInline
preload="metadata"
controls={false}
controlsList="nodownload noremoteplayback nofullscreen"
disablePictureInPicture
disableRemotePlayback
draggable={false}
onContextMenu={(e) => e.preventDefault()}
onDragStart={(e) => e.preventDefault()}
className="block w-full h-full object-cover select-none"
aria-label="Haven Paws video"
/>

  {/* Prevents simple interaction with the underlying video element. */}
  <div
    className="absolute inset-0 z-10"
    aria-hidden="true"
    onContextMenu={(e) => e.preventDefault()}
  />
</div>

);
}