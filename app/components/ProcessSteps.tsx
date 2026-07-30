type Step = {
  number: number;
  title: string;
  description: string;
  video: string | null;
};

export default function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="space-y-10">
      {steps.map((step) => (
        <div key={step.number}>
          {step.video && (
            <div className="relative mb-4">
              <video src={step.video} controls className="w-full rounded-lg" />
              <span className="absolute -bottom-3 left-3 w-9 h-9 rounded-full bg-gold text-forest font-medium flex items-center justify-center">
                {step.number}
              </span>
            </div>
          )}
          <h3 className="font-display text-lg text-forest mb-2 mt-4">{step.title}</h3>
          <p className="text-ink/80 leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  );
}