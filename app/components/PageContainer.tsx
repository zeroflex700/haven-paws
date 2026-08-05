export default function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`max-w-7xl mx-auto px-6 lg:px-10 ${className}`}>{children}</div>;
}