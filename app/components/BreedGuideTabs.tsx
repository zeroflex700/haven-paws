"use client";

import SectionTabs from "./SectionTabs";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "appearance", label: "Appearance & Grooming" },
  { id: "temperament", label: "Temperament & Characteristics" },
  { id: "health", label: "Health" },
  { id: "history", label: "History" },
  { id: "faqs", label: "FAQs" },
];

export default function BreedGuideTabs() {
  return <SectionTabs sections={TABS} />;
}