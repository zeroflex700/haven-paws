export type IncludedItemKey =
  | "health_commitment"
  | "microchip"
  | "vetted_breeder"
  | "vet_health_check"
  | "vaccinations"
  | "vet_records"
  | "white_glove_delivery"
  | "pet_insurance_discount"
  | "registration"
  | "breeder_screening"
  | "secure_payments";

export const ALL_INCLUDED_ITEMS: {
  key: IncludedItemKey;
  label: string;
}[] = [
  {
    key: "health_commitment",
    label: "10-Year Health Commitment",
  },
  {
    key: "microchip",
    label: "Microchip",
  },
  {
    key: "vetted_breeder",
    label: "Fully Vetted Breeder",
  },
  {
    key: "vet_health_check",
    label: "Nose-to-Tail Veterinarian Health Check",
  },
  {
    key: "vaccinations",
    label: "Vaccinations & Deworming",
  },
  {
    key: "vet_records",
    label: "Vet Records",
  },
  {
    key: "white_glove_delivery",
    label: "White Glove Delivery Options",
  },
  {
    key: "pet_insurance_discount",
    label: "10% Discounted Rate for Pet Insurance",
  },
  {
    key: "registration",
    label: "Registration",
  },
  {
    key: "breeder_screening",
    label: "Haven Paws Breeder Screening",
  },
  {
    key: "secure_payments",
    label: "Secure, Traceable Payments",
  },
];