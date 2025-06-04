import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZodiacSign {
  sign: string;
  symbol: string;
  iconName: string;
  color: string;
  element: string;
  dates: string;
}

interface CollectionSectionProps {
  id: string;
  zodiacSigns: ZodiacSign[];
}

export default function CollectionSection({
  id,
  zodiacSigns,
}: CollectionSectionProps) {
  return (
    <section
      className="py-24 md:py-32 px-6 bg-gradient-to-b from-background to-muted/30"
      id={id}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 md:mb-28">
          <div className="group w-fit my-4 relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <Icon icon="lucide:palette" className="w-4 h-4 mr-2 " />
            <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Digital Art Collection
            </AnimatedGradientText>
            <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Complete Collection
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Each zodiac avatar is carefully crafted with authentic symbolism and
            unique personality traits.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {zodiacSigns.map((zodiac) => (
            <Card
              key={zodiac.sign}
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-0 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{ backgroundColor: zodiac.color }}
                >
                  <Icon icon={zodiac.iconName} className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {zodiac.sign}
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: zodiac.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {zodiac.element}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{zodiac.dates}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    variant="link"
                    className="text-sm font-semibold p-0 text-primary hover:text-primary/80"
                  >
                    <span className="mr-1">View Details</span>
                    <Icon icon="lucide:arrow-right" className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
