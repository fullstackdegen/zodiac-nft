export interface ZodiacSign {
  sign: string;
  symbol: string;
  color: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  dates: string;
  startDate: { month: number; day: number };
  endDate: { month: number; day: number };
  personalityTraits: string[];
  strengthKeywords: string[];
  visualThemes: string[];
  cosmicAttributes: string[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    sign: "Aries",
    symbol: "♈",
    color: "#DC2626",
    element: "Fire",
    dates: "Mar 21 - Apr 19",
    startDate: { month: 3, day: 21 },
    endDate: { month: 4, day: 19 },
    personalityTraits: [
      "Bold and ambitious",
      "Natural-born leader",
      "Energetic and dynamic",
      "Pioneering spirit",
      "Competitive nature"
    ],
    strengthKeywords: ["courage", "determination", "confidence", "enthusiasm", "leadership"],
    visualThemes: ["ram horns", "warrior armor", "flames", "red energy", "mountain peaks"],
    cosmicAttributes: ["Mars ruled", "cardinal fire", "spring awakening", "new beginnings"]
  },
  {
    sign: "Taurus",
    symbol: "♉",
    color: "#059669",
    element: "Earth",
    dates: "Apr 20 - May 20",
    startDate: { month: 4, day: 20 },
    endDate: { month: 5, day: 20 },
    personalityTraits: [
      "Reliable and practical",
      "Strong-willed and determined",
      "Loves luxury and comfort",
      "Patient and persistent",
      "Grounded and stable"
    ],
    strengthKeywords: ["stability", "patience", "determination", "loyalty", "sensuality"],
    visualThemes: ["bull strength", "emerald crystals", "flowering gardens", "golden ornaments", "earth textures"],
    cosmicAttributes: ["Venus ruled", "fixed earth", "spring abundance", "material mastery"]
  },
  {
    sign: "Gemini",
    symbol: "♊",
    color: "#D97706",
    element: "Air",
    dates: "May 21 - Jun 20",
    startDate: { month: 5, day: 21 },
    endDate: { month: 6, day: 20 },
    personalityTraits: [
      "Adaptable and versatile",
      "Curious and intellectual",
      "Communicative and witty",
      "Quick-thinking and clever",
      "Social and expressive"
    ],
    strengthKeywords: ["communication", "adaptability", "curiosity", "wit", "versatility"],
    visualThemes: ["twin figures", "swirling winds", "geometric patterns", "golden light", "messenger wings"],
    cosmicAttributes: ["Mercury ruled", "mutable air", "late spring energy", "mental agility"]
  },
  {
    sign: "Cancer",
    symbol: "♋",
    color: "#2563EB",
    element: "Water",
    dates: "Jun 21 - Jul 22",
    startDate: { month: 6, day: 21 },
    endDate: { month: 7, day: 22 },
    personalityTraits: [
      "Nurturing and protective",
      "Emotionally intuitive",
      "Home and family oriented",
      "Sensitive and empathetic",
      "Loyal and caring"
    ],
    strengthKeywords: ["intuition", "nurturing", "protection", "empathy", "loyalty"],
    visualThemes: ["crab shell", "moon phases", "ocean waves", "silver light", "protective barriers"],
    cosmicAttributes: ["Moon ruled", "cardinal water", "summer solstice", "emotional depth"]
  },
  {
    sign: "Leo",
    symbol: "♌",
    color: "#EA580C",
    element: "Fire",
    dates: "Jul 23 - Aug 22",
    startDate: { month: 7, day: 23 },
    endDate: { month: 8, day: 22 },
    personalityTraits: [
      "Confident and charismatic",
      "Creative and dramatic",
      "Generous and warm-hearted",
      "Natural performer",
      "Strong sense of pride"
    ],
    strengthKeywords: ["confidence", "creativity", "generosity", "leadership", "passion"],
    visualThemes: ["lion's mane", "solar crown", "golden rays", "stage spotlight", "royal regalia"],
    cosmicAttributes: ["Sun ruled", "fixed fire", "midsummer power", "creative expression"]
  },
  {
    sign: "Virgo",
    symbol: "♍",
    color: "#16A34A",
    element: "Earth",
    dates: "Aug 23 - Sep 22",
    startDate: { month: 8, day: 23 },
    endDate: { month: 9, day: 22 },
    personalityTraits: [
      "Analytical and practical",
      "Perfectionist tendencies",
      "Helpful and service-oriented",
      "Detail-oriented and organized",
      "Health and wellness focused"
    ],
    strengthKeywords: ["precision", "service", "analysis", "healing", "perfectionism"],
    visualThemes: ["harvest imagery", "healing herbs", "precise geometry", "earth tones", "natural elements"],
    cosmicAttributes: ["Mercury ruled", "mutable earth", "harvest time", "practical wisdom"]
  },
  {
    sign: "Libra",
    symbol: "♎",
    color: "#DB2777",
    element: "Air",
    dates: "Sep 23 - Oct 22",
    startDate: { month: 9, day: 23 },
    endDate: { month: 10, day: 22 },
    personalityTraits: [
      "Diplomatic and fair-minded",
      "Social and cooperative",
      "Aesthetic and artistic",
      "Seeks balance and harmony",
      "Charming and gracious"
    ],
    strengthKeywords: ["balance", "harmony", "justice", "beauty", "diplomacy"],
    visualThemes: ["balanced scales", "rose petals", "pink harmony", "artistic beauty", "symmetrical designs"],
    cosmicAttributes: ["Venus ruled", "cardinal air", "autumn equinox", "social grace"]
  },
  {
    sign: "Scorpio",
    symbol: "♏",
    color: "#991B1B",
    element: "Water",
    dates: "Oct 23 - Nov 21",
    startDate: { month: 10, day: 23 },
    endDate: { month: 11, day: 21 },
    personalityTraits: [
      "Intense and passionate",
      "Mysterious and magnetic",
      "Determined and powerful",
      "Transformative nature",
      "Deeply intuitive"
    ],
    strengthKeywords: ["intensity", "transformation", "mystery", "power", "intuition"],
    visualThemes: ["scorpion imagery", "deep reds", "phoenix rising", "mysterious shadows", "transformation symbols"],
    cosmicAttributes: ["Mars & Pluto ruled", "fixed water", "deep autumn", "psychic power"]
  },
  {
    sign: "Sagittarius",
    symbol: "♐",
    color: "#7C3AED",
    element: "Fire",
    dates: "Nov 22 - Dec 21",
    startDate: { month: 11, day: 22 },
    endDate: { month: 12, day: 21 },
    personalityTraits: [
      "Adventurous and free-spirited",
      "Philosophical and optimistic",
      "Truth-seeking and honest",
      "Love of travel and exploration",
      "Enthusiastic and energetic"
    ],
    strengthKeywords: ["adventure", "wisdom", "freedom", "optimism", "exploration"],
    visualThemes: ["archer's bow", "purple flames", "distant horizons", "travel symbols", "philosophical imagery"],
    cosmicAttributes: ["Jupiter ruled", "mutable fire", "late autumn", "expansive wisdom"]
  },
  {
    sign: "Capricorn",
    symbol: "♑",
    color: "#374151",
    element: "Earth",
    dates: "Dec 22 - Jan 19",
    startDate: { month: 12, day: 22 },
    endDate: { month: 1, day: 19 },
    personalityTraits: [
      "Ambitious and disciplined",
      "Responsible and reliable",
      "Traditional and conservative",
      "Goal-oriented and persistent",
      "Practical and realistic"
    ],
    strengthKeywords: ["ambition", "discipline", "responsibility", "persistence", "achievement"],
    visualThemes: ["mountain goat", "stone textures", "ancient wisdom", "crystalline structures", "earthy grays"],
    cosmicAttributes: ["Saturn ruled", "cardinal earth", "winter solstice", "structured achievement"]
  },
  {
    sign: "Aquarius",
    symbol: "♒",
    color: "#0891B2",
    element: "Air",
    dates: "Jan 20 - Feb 18",
    startDate: { month: 1, day: 20 },
    endDate: { month: 2, day: 18 },
    personalityTraits: [
      "Independent and original",
      "Humanitarian and progressive",
      "Intellectual and innovative",
      "Unconventional and unique",
      "Friendly and detached"
    ],
    strengthKeywords: ["innovation", "independence", "humanitarianism", "originality", "progress"],
    visualThemes: ["water bearer", "electric blue", "futuristic elements", "cosmic energy", "innovation symbols"],
    cosmicAttributes: ["Saturn & Uranus ruled", "fixed air", "deep winter", "revolutionary spirit"]
  },
  {
    sign: "Pisces",
    symbol: "♓",
    color: "#9333EA",
    element: "Water",
    dates: "Feb 19 - Mar 20",
    startDate: { month: 2, day: 19 },
    endDate: { month: 3, day: 20 },
    personalityTraits: [
      "Compassionate and empathetic",
      "Artistic and imaginative",
      "Intuitive and spiritual",
      "Gentle and wise",
      "Emotionally sensitive"
    ],
    strengthKeywords: ["compassion", "intuition", "imagination", "spirituality", "empathy"],
    visualThemes: ["twin fish", "oceanic depths", "mystical purples", "ethereal mists", "spiritual symbols"],
    cosmicAttributes: ["Jupiter & Neptune ruled", "mutable water", "late winter", "spiritual transcendence"]
  }
];

export const zodiacElements = {
  Fire: { signs: ["Aries", "Leo", "Sagittarius"], keywords: ["passion", "energy", "action", "inspiration"] },
  Earth: { signs: ["Taurus", "Virgo", "Capricorn"], keywords: ["stability", "practicality", "grounding", "material"] },
  Air: { signs: ["Gemini", "Libra", "Aquarius"], keywords: ["communication", "intellect", "social", "ideas"] },
  Water: { signs: ["Cancer", "Scorpio", "Pisces"], keywords: ["emotion", "intuition", "depth", "healing"] }
} as const;

export const zodiacModalities = {
  Cardinal: { signs: ["Aries", "Cancer", "Libra", "Capricorn"], keywords: ["initiation", "leadership", "beginnings"] },
  Fixed: { signs: ["Taurus", "Leo", "Scorpio", "Aquarius"], keywords: ["stability", "determination", "persistence"] },
  Mutable: { signs: ["Gemini", "Virgo", "Sagittarius", "Pisces"], keywords: ["adaptability", "flexibility", "change"] }
} as const;

export function getZodiacByName(signName: string): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.sign.toLowerCase() === signName.toLowerCase());
}

export function getZodiacsByElement(element: string): ZodiacSign[] {
  return zodiacSigns.filter(sign => sign.element === element);
} 