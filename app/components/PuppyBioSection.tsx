"use client";

import { useState } from "react";
import { Minus, Plus, Syringe, Stethoscope, Palette, PawPrint, Ruler, Dna } from "lucide-react";

type BioRow = {
  icon: React.ReactNode;
  label: string;
  body: React.ReactNode;
};

function CollapsibleGroup({
  title,
  rows,
  defaultOpen = true,
}: {
  title: string;
  rows: BioRow[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (rows.length === 0) return null;

  return (
    <div className="border-b border-sage/10 py-6">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-display text-xl text-forest">{title}</h3>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sage/20 text-forest">
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-0.5 shrink-0 text-forest/70">{row.icon}</div>

              <div>
                <p className="text-sm font-semibold text-forest">
                  {row.label}
                </p>
                <div className="mt-1 text-sm leading-relaxed text-ink/70">
                  {row.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PuppyBioSection({
  puppyName,
  color,
  markings,
  size,
  generation,
}: {
  puppyName: string;
  color: string | null;
  markings: string | null;
  size: string | null;
  generation: string | null;
}) {
  const healthRows: BioRow[] = [
    {
      icon: <Syringe size={18} strokeWidth={1.7} />,
      label: "Vaccinations & deworming",
      body: (
        <p>
          {puppyName} will be current on vaccinations before going home.
        </p>
      ),
    },
    {
      icon: <Stethoscope size={18} strokeWidth={1.7} />,
      label: "Nose-to-tail veterinarian health check",
      body: (
        <p>
          {puppyName} will receive a nose-to-tail veterinarian health check
          before going home. You will receive copies of your pup&apos;s
          health records upon pickup.
        </p>
      ),
    },
  ];

  const appearanceRows: BioRow[] = [];

  if (color) {
    appearanceRows.push({
      icon: <Palette size={18} strokeWidth={1.7} />,
      label: "Color",
      body: <p>{color}</p>,
    });
  }

  if (markings) {
    appearanceRows.push({
      icon: <PawPrint size={18} strokeWidth={1.7} />,
      label: "Markings",
      body: <p>{markings}</p>,
    });
  }

  if (size) {
    appearanceRows.push({
      icon: <Ruler size={18} strokeWidth={1.7} />,
      label: "Size",
      body: <p>{size}</p>,
    });
  }

  if (generation) {
    appearanceRows.push({
      icon: <Dna size={18} strokeWidth={1.7} />,
      label: "Generation",
      body: <p>{generation}</p>,
    });
  }

  return (
    <div className="rounded-[24px] border border-sage/10 bg-white px-5 py-2 sm:px-7">
      <CollapsibleGroup title="Health" rows={healthRows} />
      <CollapsibleGroup title="Appearance & size" rows={appearanceRows} />
    </div>
  );
}