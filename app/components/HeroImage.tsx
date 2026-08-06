import OptimizedImage, { type OptimizedImageProps } from "./OptimizedImage";

export default function HeroImage(props: Omit<OptimizedImageProps, "priority" | "sizes">) {
  return <OptimizedImage {...props} priority sizes="100vw" />;
}