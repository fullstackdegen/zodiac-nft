import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { cn } from "@/lib/utils";

export default function FeaturesSection({ id }: { id: string }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-muted" id={id}>
      <div className="max-w-6xl mx-auto">
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
            <Icon icon="lucide:star" className="w-4 h-4 mr-2 text-primary" />
            <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Premium Features
            </AnimatedGradientText>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Why Choose Zodiac NFT?
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <Card className="text-center p-8 border-0 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="lucide:palette" className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Unique Artwork
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Each avatar is individually designed with authentic zodiac
              symbolism and vibrant colors.
            </p>
          </Card>

          <Card className="text-center p-8 border-0 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="lucide:star" className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Cosmic Identity
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Express your astrological personality with NFTs that truly
              represent your celestial essence.
            </p>
          </Card>

          <Card className="text-center p-8 border-0 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="lucide:gem" className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Premium Quality
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              512×512 high-resolution artwork with smooth linework and
              professional finish.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
