"use client";

export default function PuppySearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search by name or breed..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-sage/30 rounded-full px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-gold"
    />
  );
}