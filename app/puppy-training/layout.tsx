import TrainingPopupProvider from "../components/TrainingPopupProvider";
import { getPageImages } from "@/lib/queries/pageContent";
import { getPuppyTrainingTestimonial } from "@/lib/queries/testimonials";

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