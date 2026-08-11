import type { Metadata } from "next";
import TrainingPopupProvider from "../components/TrainingPopupProvider";
import { getPageImages } from "@/lib/queries/pageContent";
import { getPuppyTrainingTestimonial } from "@/lib/queries/testimonials";

export const metadata: Metadata = {
  title: {
    default: "Puppy Training Program",
    template: "%s | Puppy Training",
  },
  description: "Guided lessons, live coaching, and community support to help your puppy build good habits from day one.",
};

export default async function PuppyTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { extraText } = await getPageImages("puppy-training");
  const testimonial = await getPuppyTrainingTestimonial();

  const intro =
    extraText.popup_intro ??
    "This program is included as a benefit when you complete your puppy's payment on Haven Paws.";

  return (
    <TrainingPopupProvider intro={intro} testimonial={testimonial}>
      {children}
    </TrainingPopupProvider>
  );
}