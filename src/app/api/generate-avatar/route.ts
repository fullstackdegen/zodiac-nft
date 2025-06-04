import { NextRequest, NextResponse } from "next/server";
import { ZodiacAIService } from "@/services/zodiac-ai-service";
import type { ZodiacResult } from "@/lib/zodiac-calculator";

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { zodiacSign, zodiacData, userPreferences } = body;

    // Validate required data
    if (!zodiacSign || !zodiacData || !zodiacData.sign) {
      return NextResponse.json(
        { error: "Zodiac sign and data are required" },
        { status: 400 }
      );
    }

    console.log('Generating avatar for:', {
      zodiacSign,
      zodiacData,
      userPreferences: userPreferences || 'None'
    });

    // Create simplified ZodiacResult from sign data
    const simplifiedZodiacData: ZodiacResult = {
      sign: zodiacData.sign,
      symbol: zodiacData.symbol,
      element: zodiacData.element,
      color: zodiacData.color,
      dates: zodiacData.dates,
      personalityTraits: getPersonalityTraits(zodiacData.sign),
      strengthKeywords: getStrengthKeywords(zodiacData.sign),
      visualThemes: getVisualThemes(zodiacData.sign),
      cosmicAttributes: getCosmicAttributes(zodiacData.sign),
      rarityFactors: {
        birthDateRarity: 0.5,
        elementBalance: 0.5,
        seasonalAlignment: 0.5,
        cuspProximity: 0.5
      },
      birthDateMetadata: {
        season: getSeason(zodiacData.sign) as "Spring" | "Summer" | "Autumn" | "Winter",
        specialDate: undefined,
        dayOfYear: 180,
        isLeapYear: false,
        quarterOfYear: 2
      }
    };

    // Create AI service and generate avatar
    const aiService = new ZodiacAIService();
    const avatar = await aiService.generateZodiacAvatar(
      simplifiedZodiacData,
      userPreferences
    );

    return NextResponse.json({ avatar });
  } catch (error) {
    console.error("Error in generate-avatar API:", error);

    // Return appropriate error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to generate avatar: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Helper functions to get zodiac data
function getPersonalityTraits(sign: string): string[] {
  const traits: Record<string, string[]> = {
    'Aries': ['bold', 'energetic', 'pioneering', 'confident'],
    'Taurus': ['reliable', 'determined', 'patient', 'practical'],
    'Gemini': ['curious', 'adaptable', 'communicative', 'witty'],
    'Cancer': ['nurturing', 'intuitive', 'protective', 'emotional'],
    'Leo': ['confident', 'creative', 'generous', 'dramatic'],
    'Virgo': ['analytical', 'helpful', 'precise', 'practical'],
    'Libra': ['balanced', 'diplomatic', 'artistic', 'harmonious'],
    'Scorpio': ['intense', 'mysterious', 'passionate', 'transformative'],
    'Sagittarius': ['adventurous', 'optimistic', 'freedom-loving', 'philosophical'],
    'Capricorn': ['ambitious', 'disciplined', 'practical', 'responsible'],
    'Aquarius': ['innovative', 'independent', 'humanitarian', 'eccentric'],
    'Pisces': ['compassionate', 'artistic', 'intuitive', 'dreamy']
  };
  return traits[sign] || ['mystical', 'cosmic', 'unique'];
}

function getStrengthKeywords(sign: string): string[] {
  const strengths: Record<string, string[]> = {
    'Aries': ['leadership', 'courage', 'initiative'],
    'Taurus': ['stability', 'persistence', 'loyalty'],
    'Gemini': ['versatility', 'intelligence', 'communication'],
    'Cancer': ['empathy', 'protection', 'intuition'],
    'Leo': ['creativity', 'confidence', 'generosity'],
    'Virgo': ['precision', 'service', 'analysis'],
    'Libra': ['harmony', 'justice', 'beauty'],
    'Scorpio': ['transformation', 'depth', 'power'],
    'Sagittarius': ['wisdom', 'adventure', 'truth'],
    'Capricorn': ['ambition', 'structure', 'achievement'],
    'Aquarius': ['innovation', 'freedom', 'humanity'],
    'Pisces': ['compassion', 'creativity', 'spirituality']
  };
  return strengths[sign] || ['cosmic energy', 'mystical power'];
}

function getVisualThemes(sign: string): string[] {
  const themes: Record<string, string[]> = {
    'Aries': ['fire', 'ram horns', 'red energy', 'warrior gear'],
    'Taurus': ['earth', 'bull strength', 'green nature', 'golden light'],
    'Gemini': ['air', 'twin duality', 'yellow brightness', 'mercury symbols'],
    'Cancer': ['water', 'moon phases', 'silver light', 'protective shell'],
    'Leo': ['fire', 'lion mane', 'golden radiance', 'sun symbols'],
    'Virgo': ['earth', 'harvest themes', 'brown stability', 'detailed patterns'],
    'Libra': ['air', 'balanced scales', 'pink harmony', 'artistic beauty'],
    'Scorpio': ['water', 'scorpion tail', 'deep red', 'mysterious shadows'],
    'Sagittarius': ['fire', 'archer bow', 'purple wisdom', 'centaur form'],
    'Capricorn': ['earth', 'mountain goat', 'dark green', 'structured forms'],
    'Aquarius': ['air', 'water bearer', 'electric blue', 'futuristic elements'],
    'Pisces': ['water', 'twin fish', 'sea green', 'oceanic dreams']
  };
  return themes[sign] || ['cosmic', 'ethereal', 'mystical'];
}

function getCosmicAttributes(sign: string): string[] {
  const attributes: Record<string, string[]> = {
    'Aries': ['cardinal fire', 'mars energy', 'spring awakening'],
    'Taurus': ['fixed earth', 'venus beauty', 'spring growth'],
    'Gemini': ['mutable air', 'mercury communication', 'spring curiosity'],
    'Cancer': ['cardinal water', 'moon intuition', 'summer nurturing'],
    'Leo': ['fixed fire', 'sun radiance', 'summer creativity'],
    'Virgo': ['mutable earth', 'mercury precision', 'late summer harvest'],
    'Libra': ['cardinal air', 'venus harmony', 'autumn balance'],
    'Scorpio': ['fixed water', 'pluto transformation', 'autumn intensity'],
    'Sagittarius': ['mutable fire', 'jupiter expansion', 'autumn wisdom'],
    'Capricorn': ['cardinal earth', 'saturn discipline', 'winter structure'],
    'Aquarius': ['fixed air', 'uranus innovation', 'winter vision'],
    'Pisces': ['mutable water', 'neptune dreams', 'winter compassion']
  };
  return attributes[sign] || ['cosmic alignment', 'stellar energy'];
}

function getSeason(sign: string): string {
  const seasons: Record<string, string> = {
    'Aries': 'Spring', 'Taurus': 'Spring', 'Gemini': 'Spring',
    'Cancer': 'Summer', 'Leo': 'Summer', 'Virgo': 'Summer',
    'Libra': 'Autumn', 'Scorpio': 'Autumn', 'Sagittarius': 'Autumn',
    'Capricorn': 'Winter', 'Aquarius': 'Winter', 'Pisces': 'Winter'
  };
  return seasons[sign] || 'Cosmic';
}
