type VerificationBadgesProps = {
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  badge4?: string | null;
};

export default function VerificationBadges({
  badge1,
  badge2,
  badge3,
  badge4,
}: VerificationBadgesProps) {
  const badges = [badge1, badge2, badge3, badge4].filter(
    (url): url is string => Boolean(url)
  );

  // Don't show an empty section before any badges have been uploaded.
  if (badges.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-8 md:gap-10">
          {badges.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="w-full max-w-[170px] h-[100px] flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Haven Paws verification badge ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}