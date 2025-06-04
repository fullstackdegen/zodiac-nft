import OpenAI from "openai";
import type { ZodiacResult } from "@/lib/zodiac-calculator";

export interface ZodiacCharacterPrompt {
  mainPrompt: string;
  styleModifiers: string[];
  personalityTraits: string[];
  visualElements: string[];
  rarityAttributes: string[];
  cosmicTheme: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string;
  rarity?: number;
}

export interface ZodiacNFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  imagePrompt: string;
  zodiacSign: string;
  element: string;
  birthDate: string;
  personalityTraits: string[];
  rarityScore: number;
  cosmicAlignment: string;
  attributes: NFTAttribute[];
  characterPrompt: ZodiacCharacterPrompt;
  createdAt: string;
}

export class ZodiacAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCharacterPrompt(
    zodiacData: ZodiacResult,
    userPreferences?: string
  ): Promise<ZodiacCharacterPrompt> {
    const systemPrompt = `You are a cosmic artist and mystical zodiac expert. Create unique, personalized avatar descriptions based on zodiac signs and birth data. 

IMPORTANT: You must respond with ONLY a valid JSON object with these exact properties:
{
  "mainPrompt": "A detailed visual description (2-3 sentences)",
  "styleModifiers": ["artistic style element 1", "artistic style element 2", "artistic style element 3"],
  "personalityTraits": ["visual personality trait 1", "visual personality trait 2", "visual personality trait 3"],
  "visualElements": ["visual element 1", "visual element 2", "visual element 3", "visual element 4"],
  "rarityAttributes": ["rare feature 1", "rare feature 2"],
  "cosmicTheme": "One sentence describing the cosmic theme"
}

Focus on creating mystical, ethereal, collectible-quality avatars suitable for NFTs. Return ONLY the JSON object, no other text.`;

    const userPrompt = `Create a unique avatar for a ${
      zodiacData.sign
    } zodiac character.

Zodiac Details:
- Sign: ${zodiacData.sign} ${zodiacData.symbol}
- Element: ${zodiacData.element}
- Primary Color: ${zodiacData.color}
- Season: ${zodiacData.birthDateMetadata.season}
- Special Date: ${zodiacData.birthDateMetadata.specialDate || "None"}

Personality Traits: ${zodiacData.personalityTraits.join(", ")}
Strength Keywords: ${zodiacData.strengthKeywords.join(", ")}
Visual Themes: ${zodiacData.visualThemes.join(", ")}
Cosmic Attributes: ${zodiacData.cosmicAttributes.join(", ")}

User Preferences: ${
      userPreferences || "Surprise me with something mystical and unique"
    }

Rarity Factors:
- Birth Date Rarity: ${(zodiacData.rarityFactors.birthDateRarity * 100).toFixed(
      1
    )}%
- Element Balance: ${(zodiacData.rarityFactors.elementBalance * 100).toFixed(
      1
    )}%
- Cusp Proximity: ${(zodiacData.rarityFactors.cuspProximity * 100).toFixed(1)}%

Create a character that embodies this zodiac sign's essence while incorporating cosmic, mystical elements suitable for a premium NFT collection.

Respond with ONLY the JSON object.`;

    try {
      // Try with JSON mode first (newer models)
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 800,
          response_format: { type: "json_object" },
        });
      } catch {
        console.log("JSON mode not supported, falling back to regular mode");
        // Fallback to regular mode without JSON response format
        completion = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 800,
        });
      }

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      let characterPrompt: ZodiacCharacterPrompt;

      try {
        // Try to parse as JSON
        characterPrompt = JSON.parse(content) as ZodiacCharacterPrompt;
      } catch {
        console.log(
          "Failed to parse JSON, attempting to extract JSON from response"
        );
        // Try to extract JSON from the response if it's wrapped in other text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            characterPrompt = JSON.parse(jsonMatch[0]) as ZodiacCharacterPrompt;
          } catch {
            throw new Error("Unable to parse AI response as JSON");
          }
        } else {
          throw new Error("No JSON found in AI response");
        }
      }

      // Validate the response structure
      if (
        !characterPrompt.mainPrompt ||
        !characterPrompt.styleModifiers ||
        !characterPrompt.personalityTraits ||
        !characterPrompt.visualElements
      ) {
        // If validation fails, create a fallback response
        console.log("AI response validation failed, creating fallback");
        characterPrompt = this.createFallbackCharacterPrompt(zodiacData);
      }

      return characterPrompt;
    } catch (error) {
      console.error("Error generating character prompt:", error);
      // Return a fallback instead of throwing
      return this.createFallbackCharacterPrompt(zodiacData);
    }
  }

  private createFallbackCharacterPrompt(
    zodiacData: ZodiacResult
  ): ZodiacCharacterPrompt {
    return {
      mainPrompt: `A mystical ${zodiacData.sign} avatar embodying the ${
        zodiacData.element
      } element with cosmic energy flowing through ethereal forms. The character radiates ${zodiacData.strengthKeywords
        .slice(0, 2)
        .join(" and ")} in a celestial setting.`,
      styleModifiers: [
        "cosmic art",
        "ethereal lighting",
        "mystical atmosphere",
        "digital painting",
      ],
      personalityTraits: zodiacData.personalityTraits.slice(0, 3),
      visualElements: [
        ...zodiacData.visualThemes.slice(0, 3),
        `${zodiacData.element.toLowerCase()} energy`,
        "starfield background",
      ],
      rarityAttributes: [
        `${zodiacData.birthDateMetadata.season} born`,
        "cosmic alignment",
      ],
      cosmicTheme: `A ${zodiacData.sign} soul dancing with ${zodiacData.element} energy under infinite stars.`,
    };
  }

  async generateImagePrompt(
    characterPrompt: ZodiacCharacterPrompt,
    zodiacData: ZodiacResult
  ): Promise<string> {
    // Create a concise, focused prompt for better image generation

    // Add key visual elements (limited to avoid overly complex prompts)
    const visualElements = characterPrompt.visualElements.slice(0, 2);
    const styleElements = characterPrompt.styleModifiers.slice(0, 2);

    // Create a focused, policy-compliant prompt
    const imagePrompt = `A mystical ${
      zodiacData.sign
    } zodiac avatar with ${zodiacData.element.toLowerCase()} elemental powers. ${
      characterPrompt.mainPrompt.split(".")[0]
    }. 

Style: ${styleElements.join(
      ", "
    )}, cosmic digital art, ethereal lighting, mystical atmosphere.

Visual elements: ${visualElements.join(
      ", "
    )}, starfield background, cosmic energy.

Art style: High-quality digital illustration, fantasy art, cosmic theme, professional NFT artwork, centered composition.`;

    return imagePrompt;
  }

  async generateImage(imagePrompt: string): Promise<string> {
    try {
      console.log("Generating image with prompt length:", imagePrompt.length);

      const response = await this.openai.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1024x1024",
        quality: "high",
        n: 1,
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image data returned from OpenAI");
      }

      // Handle both URL and base64 responses
      const imageData = response.data[0];
      if (imageData.url) {
        return imageData.url;
      } else if (imageData.b64_json) {
        // For base64 images, we'd need to save and serve them
        // For now, return a placeholder since we're getting URLs
        return `data:image/png;base64,${imageData.b64_json}`;
      } else {
        throw new Error("No image URL or base64 data returned");
      }
    } catch (error) {
      console.error("Error generating image:", error);

      // Return a fallback placeholder image instead of throwing
      console.log("Image generation failed, returning placeholder");
      return this.createFallbackImage();
    }
  }

  private createFallbackImage(): string {
    // Return a data URL for a simple SVG placeholder
    const svgPlaceholder = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cosmicGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#9333EA;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#cosmicGrad)"/>
        <circle cx="512" cy="512" r="200" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <text x="512" y="500" text-anchor="middle" fill="white" font-size="48" font-family="Arial">🌟</text>
        <text x="512" y="560" text-anchor="middle" fill="white" font-size="24" font-family="Arial">Cosmic Avatar</text>
        <text x="512" y="590" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="16" font-family="Arial">Generated by AI</text>
      </svg>
    `;

    const base64Svg = Buffer.from(svgPlaceholder).toString("base64");
    return `data:image/svg+xml;base64,${base64Svg}`;
  }

  async createPersonalizedDescription(
    zodiacData: ZodiacResult,
    characterPrompt: ZodiacCharacterPrompt
  ): Promise<string> {
    const systemPrompt = `You are a mystical narrator creating personalized descriptions for zodiac-based NFT avatars. Write engaging, cosmic descriptions that make the owner feel connected to their unique avatar.`;

    const userPrompt = `Create a personalized description for this zodiac avatar:

Zodiac: ${zodiacData.sign} ${zodiacData.symbol}
Element: ${zodiacData.element}
Season: ${zodiacData.birthDateMetadata.season}
${
  zodiacData.birthDateMetadata.specialDate
    ? `Special Date: ${zodiacData.birthDateMetadata.specialDate}`
    : ""
}

Character Description: ${characterPrompt.mainPrompt}
Cosmic Theme: ${characterPrompt.cosmicTheme}

Write a mystical, engaging description (2-3 sentences) that:
1. Connects the owner to their zodiac essence
2. Highlights unique traits and cosmic alignment
3. Makes them feel special about their avatar
4. Mentions any rare features or special birth attributes

Keep it mystical but not overly dramatic.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return (
        completion.choices[0]?.message?.content ||
        this.createFallbackDescription(zodiacData)
      );
    } catch (error) {
      console.error("Error generating description:", error);
      return this.createFallbackDescription(zodiacData);
    }
  }

  private createFallbackDescription(zodiacData: ZodiacResult): string {
    return `Born under the ${zodiacData.sign} constellation, this cosmic avatar channels the pure essence of ${zodiacData.element} energy. Your ${zodiacData.birthDateMetadata.season} birth aligns you with celestial forces, creating a unique spiritual signature that resonates through the digital cosmos.`;
  }

  async generateZodiacAvatar(
    zodiacData: ZodiacResult,
    userInput?: string,
    birthDate?: string
  ): Promise<ZodiacNFTMetadata> {
    try {
      // Step 1: Generate character prompt using AI
      const characterPrompt = await this.generateCharacterPrompt(
        zodiacData,
        userInput
      );

      // Step 2: Create optimized image prompt
      const imagePrompt = await this.generateImagePrompt(
        characterPrompt,
        zodiacData
      );

      // Step 3: Generate image using the new model
      const imageUrl = await this.generateImage(imagePrompt);

      // Step 4: Create personalized description
      const personalizedDescription = await this.createPersonalizedDescription(
        zodiacData,
        characterPrompt
      );

      // Step 5: Calculate rarity score
      const rarityScore = this.calculateRarityScore(
        zodiacData,
        characterPrompt
      );

      // Step 6: Create metadata
      const avatarId = `zodiac_${zodiacData.sign.toLowerCase()}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const metadata: ZodiacNFTMetadata = {
        id: avatarId,
        name: `${zodiacData.sign} Cosmic Avatar`,
        description: personalizedDescription,
        image: imageUrl,
        imagePrompt,
        zodiacSign: zodiacData.sign,
        element: zodiacData.element,
        birthDate: birthDate || new Date().toISOString().split("T")[0],
        personalityTraits: zodiacData.personalityTraits,
        rarityScore,
        cosmicAlignment: this.generateCosmicAlignment(zodiacData),
        attributes: this.generateNFTAttributes(
          zodiacData,
          characterPrompt,
          rarityScore
        ),
        characterPrompt,
        createdAt: new Date().toISOString(),
      };

      return metadata;
    } catch (error) {
      console.error("Error generating zodiac avatar:", error);
      throw new Error("Failed to generate zodiac avatar");
    }
  }

  private calculateRarityScore(
    zodiacData: ZodiacResult,
    characterPrompt: ZodiacCharacterPrompt
  ): number {
    let score = 0;

    // Base rarity from zodiac calculation
    score += zodiacData.rarityFactors.birthDateRarity * 0.3;
    score += zodiacData.rarityFactors.elementBalance * 0.2;
    score += zodiacData.rarityFactors.cuspProximity * 0.3;

    // Rarity attributes count
    score += (characterPrompt.rarityAttributes.length / 5) * 0.2;

    return Math.min(score * 100, 100); // Convert to percentage, max 100
  }

  private generateCosmicAlignment(zodiacData: ZodiacResult): string {
    const alignments = [
      `${zodiacData.element} Ascending`,
      `${zodiacData.birthDateMetadata.season} Cosmic Flow`,
      `${zodiacData.symbol} Constellation`,
      `${zodiacData.element}-${zodiacData.birthDateMetadata.season} Harmony`,
    ];

    return alignments[Math.floor(Math.random() * alignments.length)];
  }

  private generateNFTAttributes(
    zodiacData: ZodiacResult,
    characterPrompt: ZodiacCharacterPrompt,
    rarityScore: number
  ): NFTAttribute[] {
    const attributes: NFTAttribute[] = [
      { trait_type: "Zodiac Sign", value: zodiacData.sign },
      { trait_type: "Element", value: zodiacData.element },
      { trait_type: "Season", value: zodiacData.birthDateMetadata.season },
      { trait_type: "Rarity Score", value: rarityScore.toFixed(1) + "%" },
      { trait_type: "Cosmic Theme", value: characterPrompt.cosmicTheme },
    ];

    // Add special date if exists
    if (zodiacData.birthDateMetadata.specialDate) {
      attributes.push({
        trait_type: "Special Date",
        value: zodiacData.birthDateMetadata.specialDate,
        rarity: 95, // Special dates are rare
      });
    }

    // Add rarity attributes
    characterPrompt.rarityAttributes.forEach((attr, index) => {
      attributes.push({
        trait_type: `Rare Feature ${index + 1}`,
        value: attr,
        rarity: 85 + index * 5, // Increasing rarity
      });
    });

    return attributes;
  }
}
