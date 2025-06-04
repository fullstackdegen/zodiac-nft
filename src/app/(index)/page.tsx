"use client";

import { useRef } from "react";
import Background from "@/components/background";
import HeroSection from "@/components/hero-section";
import MintCard, { MintCardRef } from "@/components/mint-card";
import CollectionSection from "@/components/collection-section";
import FeaturesSection from "@/components/features-section";

export default function Home() {
  const mintCardRef = useRef<MintCardRef>(null);

  const zodiacSigns = [
    {
      sign: "Aries",
      symbol: "♈",
      iconName: "mdi:zodiac-aries",
      color: "#DC2626",
      element: "Fire",
      dates: "Mar 21 - Apr 19",
    },
    {
      sign: "Taurus",
      symbol: "♉",
      iconName: "mdi:zodiac-taurus",
      color: "#059669",
      element: "Earth",
      dates: "Apr 20 - May 20",
    },
    {
      sign: "Gemini",
      symbol: "♊",
      iconName: "mdi:zodiac-gemini",
      color: "#D97706",
      element: "Air",
      dates: "May 21 - Jun 20",
    },
    {
      sign: "Cancer",
      symbol: "♋",
      iconName: "mdi:zodiac-cancer",
      color: "#2563EB",
      element: "Water",
      dates: "Jun 21 - Jul 22",
    },
    {
      sign: "Leo",
      symbol: "♌",
      iconName: "mdi:zodiac-leo",
      color: "#EA580C",
      element: "Fire",
      dates: "Jul 23 - Aug 22",
    },
    {
      sign: "Virgo",
      symbol: "♍",
      iconName: "mdi:zodiac-virgo",
      color: "#16A34A",
      element: "Earth",
      dates: "Aug 23 - Sep 22",
    },
    {
      sign: "Libra",
      symbol: "♎",
      iconName: "mdi:zodiac-libra",
      color: "#DB2777",
      element: "Air",
      dates: "Sep 23 - Oct 22",
    },
    {
      sign: "Scorpio",
      symbol: "♏",
      iconName: "mdi:zodiac-scorpio",
      color: "#991B1B",
      element: "Water",
      dates: "Oct 23 - Nov 21",
    },
    {
      sign: "Sagittarius",
      symbol: "♐",
      iconName: "mdi:zodiac-sagittarius",
      color: "#7C3AED",
      element: "Fire",
      dates: "Nov 22 - Dec 21",
    },
    {
      sign: "Capricorn",
      symbol: "♑",
      iconName: "mdi:zodiac-capricorn",
      color: "#374151",
      element: "Earth",
      dates: "Dec 22 - Jan 19",
    },
    {
      sign: "Aquarius",
      symbol: "♒",
      iconName: "mdi:zodiac-aquarius",
      color: "#0891B2",
      element: "Air",
      dates: "Jan 20 - Feb 18",
    },
    {
      sign: "Pisces",
      symbol: "♓",
      iconName: "mdi:zodiac-pisces",
      color: "#9333EA",
      element: "Water",
      dates: "Feb 19 - Mar 20",
    },
  ];

  const handleClaimDestiny = () => {
    mintCardRef.current?.focusSelect();
  };

  return (
    <div className="w-full">
      {/* Hero Section with Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Animation */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Background
            color={[0.98, 0.98, 0.99]}
            mouseReact={true}
            amplitude={0.03}
            speed={0.5}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 py-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <HeroSection id="home" onClaimDestiny={handleClaimDestiny} />
            <MintCard ref={mintCardRef} id="mint" zodiacSigns={zodiacSigns} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bou  nce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
      </section>

      <CollectionSection id="collection" zodiacSigns={zodiacSigns} />
      <FeaturesSection id="features" />
    </div>
  );
}
