import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start  mb-2">
                <Image 
                  src="/favicon.png" 
                  alt="Zodiac NFT" 
                  className="w-12 h-12"
                  width={40}
                  height={40}
                />
              <span className="text-lg font-bold text-foreground">
                ZodiacNFT
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Zodiac NFT. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
