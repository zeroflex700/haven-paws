"use client";

import { useEffect, useState } from "react";

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

function isCloudinaryUrl(src: string) {
return src.includes("res.cloudinary.com") && src.includes("/upload/");
}

function cloudinaryUrl(src: string, width?: number) {
if (!isCloudinaryUrl(src)) return src;

const transformation = width
? "w_${width},q_auto,f_auto,c_limit"
: "q_auto,f_auto,c_limit";

return src.replace("/upload/", "/upload/${transformation}/");
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
const [usingOriginal, setUsingOriginal] = useState(false);

useEffect(() => {
setLoaded(false);
setFailed(false);
setUsingOriginal(false);
}, [src]);

if (!src) {
return (
<div
className={"relative w-full h-full bg-cream-alt flex items-center justify-center ${containerClassName}"}
>
<span className="text-sage text-xs">No image</span>
</div>
);
}

const optimizedSrc = cloudinaryUrl(src, width);
const imageSrc =
usingOriginal || optimizedSrc === src ? src : optimizedSrc;

function handleError() {
if (!usingOriginal && optimizedSrc !== src) {
setUsingOriginal(true);
setLoaded(false);
return;
}

setFailed(true);
setLoaded(false);

}

if (failed) {
return (
<div
className={"relative w-full h-full bg-cream-alt flex items-center justify-center ${containerClassName}"}
>
<div className="text-center px-4">
<span className="block text-sage text-xs">
Image unavailable
</span>
</div>
</div>
);
}

return (
<div
className={"relative overflow-hidden ${ fill ? "w-full h-full" : "" } ${containerClassName}"}
>
{!loaded && (
<div
aria-hidden="true"
className="absolute inset-0 bg-cream-alt animate-pulse"
/>
)}

  <img
    src={imageSrc}
    alt={alt}
    width={!fill ? width : undefined}
    height={!fill ? height : undefined}
    sizes={sizes}
    loading={priority ? "eager" : "lazy"}
    decoding="async"
    draggable={false}
    onLoad={() => setLoaded(true)}
    onError={handleError}
    onContextMenu={(e) => e.preventDefault()}
    className={`${
      fill
        ? "absolute inset-0 w-full h-full"
        : "w-full h-auto"
    } object-cover transition-opacity duration-300 ${
      loaded ? "opacity-100" : "opacity-0"
    } ${className}`}
  />
</div>

);
}