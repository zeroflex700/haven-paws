export type NavLink = { label: string; href: string };
export type NavSection = { title: string; links: NavLink[] };

export function buildNavSections(loggedIn: boolean): NavSection[] {
  return [
    {
      title: "Explore",
      links: [
        { label: "Browse All Puppies", href: "/puppies" },
        { label: "Explore Available Breeds", href: "/breeds" },
        { label: "Explore by Lifestyle", href: "/lifestyle" },
      ],
    },
    {
      title: "For Puppy Parents",
      links: [
        {
          label: loggedIn ? "My Account" : "Log In or Sign Up",
          href: loggedIn ? "/account" : "/account/login",
        },
        { label: "Breed Guides", href: "/breed-guides" },
        { label: "Puppy Training Program", href: "/puppy-training" },
        { label: "AKC Registration", href: "/akc-registration" },
        { label: "AKC Benefits", href: "/akc-benefits" },
        { label: "Fetch Insurance", href: "/fetch-insurance" },
        { label: "Haven Paws Reviews", href: "/reviews" },
      ],
    },
    {
      title: "For Breeders",
      links: [
        { label: "New Breeder Application", href: "/contact#breeder-application" },
        { label: "Breeder Standards", href: "/breeder-standards" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Help Center", href: "/help-center" },
        { label: "FAQs", href: "/faqs" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
    {
      title: "About Haven Paws",
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "About Us", href: "/about" },
        { label: "Our Promise", href: "/our-promise" },
        { label: "Our Delivery Programs", href: "/delivery" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
  ];
}