import { zodiacSigns, type ZodiacSign } from "./zodiac-data";

export interface BirthDateMetadata {
  dayOfYear: number;
  isLeapYear: boolean;
  moonPhase?: string;
  specialDate?: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  quarterOfYear: 1 | 2 | 3 | 4;
}

export interface ZodiacResult {
  sign: string;
  symbol: string;
  color: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  dates: string;
  personalityTraits: string[];
  strengthKeywords: string[];
  visualThemes: string[];
  cosmicAttributes: string[];
  birthDateMetadata: BirthDateMetadata;
  rarityFactors: {
    birthDateRarity: number;
    elementBalance: number;
    seasonalAlignment: number;
    cuspProximity: number;
  };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getSeason(
  month: number,
  day: number
): "Spring" | "Summer" | "Autumn" | "Winter" {
  if (
    (month === 3 && day >= 20) ||
    month === 4 ||
    month === 5 ||
    (month === 6 && day <= 20)
  ) {
    return "Spring";
  } else if (
    (month === 6 && day >= 21) ||
    month === 7 ||
    month === 8 ||
    (month === 9 && day <= 22)
  ) {
    return "Summer";
  } else if (
    (month === 9 && day >= 23) ||
    month === 10 ||
    month === 11 ||
    (month === 12 && day <= 21)
  ) {
    return "Autumn";
  } else {
    return "Winter";
  }
}

function getQuarterOfYear(month: number): 1 | 2 | 3 | 4 {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}

function calculateBirthDateRarity(metadata: BirthDateMetadata): number {
  let rarity = 0.5; // Base rarity

  // Leap year bonus
  if (metadata.isLeapYear) rarity += 0.1;

  // Special dates bonus
  if (metadata.specialDate) rarity += 0.2;

  // Day of year rarity (extreme early/late in year)
  if (metadata.dayOfYear <= 10 || metadata.dayOfYear >= 355) rarity += 0.15;

  return Math.min(rarity, 1.0);
}

function calculateCuspProximity(
  birthDate: Date,
  zodiacSign: ZodiacSign
): number {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // Check proximity to start date
  const startProximity = Math.abs(
    (month - zodiacSign.startDate.month) * 30 + (day - zodiacSign.startDate.day)
  );

  // Check proximity to end date
  const endProximity = Math.abs(
    (month - zodiacSign.endDate.month) * 30 + (day - zodiacSign.endDate.day)
  );

  const minProximity = Math.min(startProximity, endProximity);

  // Higher rarity for cusp dates (within 2 days)
  return minProximity <= 2 ? 0.8 : 0.3;
}

function getSpecialDate(month: number, day: number): string | undefined {
  const specialDates: Record<string, string> = {
    "2-29": "Leap Day",
    "3-20": "Spring Equinox",
    "6-21": "Summer Solstice",
    "9-22": "Autumn Equinox",
    "12-21": "Winter Solstice",
    "1-1": "New Year",
    "12-31": "New Year's Eve",
    "2-14": "Valentine's Day",
    "10-31": "Halloween",
    "12-25": "Christmas",
  };

  const key = `${month}-${day}`;
  return specialDates[key];
}

function calculateElementBalance(element: string, season: string): number {
  // Element-season alignments for rarity calculation
  const alignments: Record<string, string[]> = {
    Fire: ["Summer", "Spring"],
    Earth: ["Autumn", "Winter"],
    Air: ["Spring", "Summer"],
    Water: ["Winter", "Autumn"],
  };

  const elementSeasons = alignments[element];
  return elementSeasons && elementSeasons.indexOf(season) !== -1 ? 0.7 : 0.4;
}

export function calculateZodiacFromDate(birthDate: Date): ZodiacResult {
  const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  // Find matching zodiac sign
  let matchedSign: ZodiacSign | undefined;

  for (const sign of zodiacSigns) {
    const { startDate, endDate } = sign;

    // Handle year transition (Capricorn case)
    if (startDate.month > endDate.month) {
      // Sign spans across year boundary
      if (
        (month === startDate.month && day >= startDate.day) ||
        (month === endDate.month && day <= endDate.day) ||
        month > startDate.month ||
        month < endDate.month
      ) {
        matchedSign = sign;
        break;
      }
    } else {
      // Normal case within same year
      if (
        (month === startDate.month && day >= startDate.day) ||
        (month === endDate.month && day <= endDate.day) ||
        (month > startDate.month && month < endDate.month)
      ) {
        matchedSign = sign;
        break;
      }
    }
  }

  if (!matchedSign) {
    throw new Error(
      `Unable to determine zodiac sign for date: ${month}/${day}`
    );
  }

  // Calculate metadata
  const dayOfYear = getDayOfYear(birthDate);
  const isLeap = isLeapYear(year);
  const specialDate = getSpecialDate(month, day);
  const season = getSeason(month, day);
  const quarterOfYear = getQuarterOfYear(month);

  const birthDateMetadata: BirthDateMetadata = {
    dayOfYear,
    isLeapYear: isLeap,
    specialDate,
    season,
    quarterOfYear,
  };

  // Calculate rarity factors
  const rarityFactors = {
    birthDateRarity: calculateBirthDateRarity(birthDateMetadata),
    elementBalance: calculateElementBalance(matchedSign.element, season),
    seasonalAlignment:
      season === "Spring" ? 0.8 : season === "Summer" ? 0.7 : 0.5,
    cuspProximity: calculateCuspProximity(birthDate, matchedSign),
  };

  return {
    sign: matchedSign.sign,
    symbol: matchedSign.symbol,
    color: matchedSign.color,
    element: matchedSign.element,
    dates: matchedSign.dates,
    personalityTraits: matchedSign.personalityTraits,
    strengthKeywords: matchedSign.strengthKeywords,
    visualThemes: matchedSign.visualThemes,
    cosmicAttributes: matchedSign.cosmicAttributes,
    birthDateMetadata,
    rarityFactors,
  };
}

export function calculateCosmicRarity(zodiacResult: ZodiacResult): number {
  const { rarityFactors } = zodiacResult;

  // Weighted average of rarity factors
  const weights = {
    birthDateRarity: 0.3,
    elementBalance: 0.2,
    seasonalAlignment: 0.2,
    cuspProximity: 0.3,
  };

  return (
    rarityFactors.birthDateRarity * weights.birthDateRarity +
    rarityFactors.elementBalance * weights.elementBalance +
    rarityFactors.seasonalAlignment * weights.seasonalAlignment +
    rarityFactors.cuspProximity * weights.cuspProximity
  );
}
