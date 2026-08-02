export type LifestyleBreed = { name: string; trait: string };

export type LifestyleCategory = {
  key: string;
  title: string;
  description: string;
  breeds: LifestyleBreed[];
};

export const LIFESTYLE_CATEGORIES: LifestyleCategory[] = [
  {
    key: "active",
    title: "Active Dog Breeds",
    description:
      "Are you someone who enjoys an energetic lifestyle and wants a loyal companion ready to join you on every adventure? These athletic and enthusiastic dog breeds are perfect for families and individuals who love staying active. With their playful personalities and love for movement, they'll happily accompany you on outdoor activities, exercise routines, hikes, and exciting everyday experiences.",
    breeds: [
      { name: "Australian Shepherd", trait: "Athletic, loyal, sharp" },
      { name: "Siberian Husky", trait: "Energetic, adventurous, strong" },
      { name: "Labrador Retriever", trait: "Playful, athletic, friendly" },
      { name: "Jack Russell Terrier", trait: "Bold, spirited, tireless" },
      { name: "Rhodesian Ridgeback", trait: "Powerful, confident, active" },
      { name: "Boxer", trait: "Energetic, playful, devoted" },
    ],
  },
  {
    key: "apartment",
    title: "Apartment-Friendly Dog Breeds",
    description:
      "Living in an apartment, condo, or smaller home doesn't mean you can't enjoy the companionship of a wonderful dog. These adaptable breeds are well-suited for smaller living spaces thanks to their manageable energy levels and easygoing personalities.\n\nMany of these dogs are happy with daily walks, playtime, and plenty of affection before relaxing by your side at home. When choosing a dog for apartment living, it's important to consider factors such as activity needs, barking tendencies, temperament, and how well the breed fits your lifestyle.\n\nExplore our recommended apartment-friendly dog breeds to find a companion that feels right at home in your space.",
    breeds: [
      { name: "French Bulldog", trait: "Calm, affectionate, compact" },
      { name: "Shih Tzu", trait: "Gentle, sociable, easygoing" },
      { name: "Cavalier King Charles Spaniel", trait: "Sweet, adaptable, gentle" },
      { name: "Pug", trait: "Charming, mellow, playful" },
      { name: "Havanese", trait: "Affectionate, cheerful, adaptable" },
      { name: "Maltese", trait: "Gentle, alert, loving" },
    ],
  },
  {
    key: "family",
    title: "Family-Friendly Dog Breeds",
    description:
      "Finding the right puppy for your family is an important decision that depends on your lifestyle, home environment, activity level, and the ages of your children. The ideal family companion should be loving, adaptable, and comfortable becoming part of your everyday life.\n\nWhether your family enjoys outdoor adventures, relaxing at home, or spending quality time together, choosing a breed with the right temperament, energy level, and personality can make all the difference.\n\nExplore our recommended family-friendly dog breeds to discover the perfect puppy to bring joy, companionship, and unconditional love to your home.",
    breeds: [
      { name: "Golden Retriever", trait: "Gentle, patient, loving" },
      { name: "Labrador Retriever", trait: "Friendly, loyal, easygoing" },
      { name: "Goldendoodle", trait: "Affectionate, playful, smart" },
      { name: "Cavalier King Charles Spaniel", trait: "Sweet, gentle, adaptable" },
      { name: "Old English Sheepdog", trait: "Gentle, playful, devoted" },
      { name: "Boxer", trait: "Playful, protective, loving" },
    ],
  },
  {
    key: "teacup",
    title: "Teacup Puppy Breeds",
    description:
      "Teacup puppies are known for their exceptionally small size, charming personalities, and adorable appearance. Their tiny frames make them easy to carry and great companions for people who enjoy having their furry friend close by wherever they go.\n\nDespite their small size, teacup puppies require a high level of care and attention. Their delicate bodies make them more vulnerable to accidental injuries and health concerns, so they need a safe, comfortable, and carefully prepared home environment.\n\nFamilies considering adding a teacup puppy should be ready to provide extra care, gentle handling, and a loving space where their tiny companion can stay happy, healthy, and protected.",
    breeds: [
      { name: "Chihuahua", trait: "Tiny, alert, spirited" },
      { name: "Yorkshire Terrier", trait: "Feisty, affectionate, compact" },
      { name: "Maltese", trait: "Gentle, delicate, loving" },
      { name: "Pomeranian", trait: "Fluffy, lively, bold" },
      { name: "Shih Tzu", trait: "Sweet, small, sociable" },
      { name: "Papillon", trait: "Dainty, clever, alert" },
    ],
  },
  {
    key: "allergy",
    title: "Allergy-Friendly Dog Breeds",
    description:
      "While no dog breed is completely free of allergens, some breeds are known to be a better choice for people with sensitivities. These dogs typically shed less and produce lower amounts of dander, which is one of the main triggers associated with pet allergies.\n\nIf you or someone in your household experiences allergies but still wants the companionship of a dog, exploring breeds with lower shedding tendencies may help you find a better match.\n\nDiscover our recommended allergy-friendly dog breeds and find a loving companion that fits your lifestyle.",
    breeds: [
      { name: "Poodle", trait: "Low-shed, smart, elegant" },
      { name: "Labradoodle", trait: "Low-shed, friendly, active" },
      { name: "Goldendoodle", trait: "Low-shed, affectionate, playful" },
      { name: "Bichon Frise", trait: "Low-shed, cheerful, gentle" },
      { name: "Havanese", trait: "Low-shed, sociable, sweet" },
      { name: "Soft Coated Wheaten Terrier", trait: "Low-shed, spirited, loyal" },
    ],
  },
  {
    key: "doodle",
    title: "Doodle Puppy Breeds",
    description:
      "Doodle dogs are a popular group of mixed breeds created by combining a Poodle with another dog breed. The name \"Doodle\" comes from this Poodle heritage, which can also be seen in breeds such as Cockapoos, Shih Poos, Cavapoos, and many other Poodle mixes.\n\nKnown for their intelligence, affectionate nature, and eagerness to learn, Doodle puppies often make wonderful companions for a variety of families. With many different sizes, appearances, and personalities available, there's a Doodle breed to match many different lifestyles.",
    breeds: [
      { name: "Goldendoodle", trait: "Smart, affectionate, playful" },
      { name: "Labradoodle", trait: "Friendly, clever, active" },
      { name: "Cavapoo", trait: "Gentle, sociable, smart" },
      { name: "Cockapoo", trait: "Cheerful, loyal, smart" },
      { name: "Sheepadoodle", trait: "Playful, gentle, clever" },
      { name: "Aussiedoodle", trait: "Energetic, smart, loyal" },
    ],
  },
];