"use client";

import { useTrainingPopup } from "./TrainingPopupProvider";

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-100 text-green-900",
  orange: "bg-orange-100 text-orange-900",
  yellow: "bg-yellow-100 text-yellow-900",
  pink: "bg-pink-100 text-pink-900",
  lavender: "bg-purple-100 text-purple-900",
  gray: "bg-gray-100 text-blue-900",
};

export default function TrainingCard({
  title,
  description,
  color,
  byline,
  number,
}: {
  title: string;
  description?: string;
  color: keyof typeof COLOR_MAP;
  byline?: string;
  number?: number;
}) {
  const { open } = useTrainingPopup();

  return (
    <button
      onClick={open}
      className={`text-left rounded-lg p-4 w-full h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:shadow-none ${COLOR_MAP[color]}`}
    >
      {number && <p className="font-display text-lg mb-1">{`0${number}`.slice(-2)}</p>}
      <p className="font-medium mb-1">{title}</p>
      {description && <p className="text-sm opacity-80">{description}</p>}
      {byline && <p className="text-xs opacity-60 mt-2">By {byline}</p>}
    </button>
  );
}