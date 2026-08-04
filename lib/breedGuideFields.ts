export type ScorecardFieldType = "score" | "text";

export type ScorecardField = {
  key: string;
  label: string;
  group: string;
  type: ScorecardFieldType;
};

export const SCORECARD_FIELDS: ScorecardField[] = [
  { key: "affectionate_with_family", label: "Affectionate with Family", group: "Characteristics and Temperament", type: "score" },
  { key: "watchdog_level", label: "Watchdog Level", group: "Characteristics and Temperament", type: "score" },
  { key: "playfulness", label: "Playfulness", group: "Characteristics and Temperament", type: "score" },
  { key: "adaptability", label: "Adaptability", group: "Characteristics and Temperament", type: "score" },
  { key: "social_needs", label: "Social Needs", group: "Characteristics and Temperament", type: "score" },
  { key: "temperament", label: "Temperament", group: "Characteristics and Temperament", type: "text" },
  { key: "intelligence", label: "Intelligence", group: "Characteristics and Temperament", type: "score" },
  { key: "good_with_other_dogs", label: "Good with Other Dogs", group: "Characteristics and Temperament", type: "score" },
  { key: "good_with_cats", label: "Good with Cats/Other Pets", group: "Characteristics and Temperament", type: "score" },
  { key: "friendly_with_strangers", label: "Friendly with Strangers", group: "Characteristics and Temperament", type: "score" },
  { key: "good_service_dog", label: "Good as a Service Dog", group: "Characteristics and Temperament", type: "score" },
  { key: "good_for_apartments", label: "Good for Apartments", group: "Characteristics and Temperament", type: "score" },
  { key: "barking_level", label: "Barking Level", group: "Characteristics and Temperament", type: "score" },

  { key: "height", label: "Height", group: "Appearance", type: "text" },
  { key: "size", label: "Size", group: "Appearance", type: "text" },
  { key: "colors", label: "Colors", group: "Appearance", type: "text" },
  { key: "coat_texture", label: "Coat Texture", group: "Appearance", type: "text" },
  { key: "coat_length", label: "Coat Length", group: "Appearance", type: "text" },

  { key: "exercise_needs", label: "Exercise Needs", group: "Exercise", type: "score" },
  { key: "exercise_time", label: "Exercise Time", group: "Exercise", type: "text" },
  { key: "mental_exercise_needs", label: "Mental Exercise Needs", group: "Exercise", type: "score" },
  { key: "favorite_activities", label: "Favorite Activities", group: "Exercise", type: "text" },

  { key: "grooming_needs", label: "Grooming Needs", group: "Grooming", type: "score" },
  { key: "brushing_frequency", label: "Brushing Frequency", group: "Grooming", type: "text" },
  { key: "needs_professional_grooming", label: "Needs Professional Grooming?", group: "Grooming", type: "text" },
  { key: "drooling_level", label: "Drooling Level", group: "Grooming", type: "score" },

  { key: "trainability", label: "Trainability", group: "Training", type: "score" },

  { key: "bred_for", label: "Bred For", group: "Other", type: "text" },
  { key: "country_of_origin", label: "Country of Origin", group: "Other", type: "text" },
  { key: "popularity_level", label: "Popularity Level", group: "Other", type: "text" },
  { key: "lifespan", label: "Lifespan", group: "Other", type: "text" },
];

export const SCORECARD_GROUPS = [
  "Characteristics and Temperament",
  "Appearance",
  "Exercise",
  "Grooming",
  "Training",
  "Other",
];

export const AT_A_GLANCE_KEYS = [
  "exercise_needs",
  "size",
  "trainability",
  "grooming_needs",
  "lifespan",
  "barking_level",
];