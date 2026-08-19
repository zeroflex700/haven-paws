"use client";

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
className = "",
containerClassName = "",
}: OptimizedImageProps) {
if (!src) {
return (
<div
className={"w-full h-full bg-cream-alt flex items-center justify-center ${containerClassName}"}
>
<span className="text-sage text-xs">
No image source
</span>
</div>
);
}

return (
<div
className={"relative overflow-hidden ${ fill ? "w-full h-full" : "" } ${containerClassName}"}
>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img
src={src}
alt={alt}
width={!fill ? width : undefined}
height={!fill ? height : undefined}
draggable={false}
onContextMenu={(e) => e.preventDefault()}
onDragStart={(e) => e.preventDefault()}
className={"${ fill ? "absolute inset-0 w-full h-full" : "w-full h-auto" } object-cover ${className}"}
/>
</div>
);
}