"use client";

import Image from "next/image";
import Link from "next/link";
import ConnectWalletButton from "./connect-wallet-button";

export default function Header() {

  const scrollBehavior = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/50 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Zodiac NFT"
                width={60}
                height={60}
                className="h-24 w-24 object-cover"
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              onClick={() => scrollBehavior("mint")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              Mint
            </a>
            <a
              onClick={() => scrollBehavior("collection")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              Collection
            </a>
            <a
              onClick={() => scrollBehavior("features")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer "
            >
              Features
            </a>
          </nav>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
