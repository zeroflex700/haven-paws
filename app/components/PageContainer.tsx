export default function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hasCustomMaxWidth = /(^|\s)max-w-/.test(className);
  const base = hasCustomMaxWidth ? "mx-auto px-6 lg:px-10" : "max-w-7xl mx-auto px-6 lg:px-10";

  return <div className={`${base} ${className}`.trim().replace(/\s+/g, " ")}>{children}</div>;
}