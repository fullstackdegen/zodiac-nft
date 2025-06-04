"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface HeroSectionProps {
  id: string;
  onClaimDestiny: () => void;
}

export default function HeroSection({ id, onClaimDestiny }: HeroSectionProps) {
  return (
    <div className="text-center lg:text-left space-y-12" id={id}>
      <div className="space-y-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight tracking-tight">
          <div className="relative inline-block">
            <span className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight -tracking-normal">
              Zodiac NFT
            </span>
          </div>
        </h1>

        <div className="max-w-xl mx-auto lg:mx-0">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
            Discover your cosmic identity through authentic zodiac artistry.
          </p>
          <p className="text-base md:text-lg text-gray-500 mt-3 font-light">
            Each NFT embodies the essence of your celestial sign.
          </p>
        </div>
      </div>

      {/* CTA Buttons - Minimalist Design */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Button
          size="lg"
          className="px-10 py-4 text-lg font-light rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={onClaimDestiny}
        >
          <Icon icon="lucide:sparkles" className="w-5 h-5 mr-3" />
          Claim Your Destiny
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="px-10 py-4 text-lg font-light rounded-2xl border-gray-400 text-gray-700 hover:bg-gray-100/50 transition-all duration-300"
        >
          <Icon icon="lucide:eye" className="w-5 h-5 mr-3" />
          Explore Collection
        </Button>
      </div>

      {/* Stats - Clean & Minimal */}
      <div className="grid grid-cols-3 gap-12 max-w-md mx-auto lg:mx-0 pt-8">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extralight text-gray-900 mb-1">
            12
          </div>
          <div className="text-sm text-gray-600 font-light uppercase tracking-wide">
            Signs
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extralight text-gray-900 mb-1">
            0.02
          </div>
          <div className="text-sm text-gray-600 font-light uppercase tracking-wide">
            SOL
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-extralight text-gray-900 mb-1">
            ∞
          </div>
          <div className="text-sm text-gray-600 font-light uppercase tracking-wide">
            Endless
          </div>
        </div>
      </div>
    </div>
  );
}
