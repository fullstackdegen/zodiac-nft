import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/providers/wallet-provider";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zodiac NFT Avatar Generator | AI-Powered Cosmic Characters",
  description:
    "Generate unique zodiac-based NFT avatars from your birth date using AI. Create personalized cosmic characters and mint them on Solana.",
  keywords:
    "zodiac, NFT, avatar, AI, generator, cosmic, astrology, Solana, blockchain",
  authors: [{ name: "Zodiac NFT Team" }],
  openGraph: {
    title: "Zodiac NFT Avatar Generator",
    description:
      "Generate unique zodiac-based NFT avatars from your birth date using AI",
    type: "website",
    images: ["/og-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac NFT Avatar Generator",
    description:
      "Generate unique zodiac-based NFT avatars from your birth date using AI",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-y-auto`}
      >
        <ErrorBoundary>
          <WalletContextProvider>
            <main className="relative">{children}</main>
          </WalletContextProvider>
        </ErrorBoundary>
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </body>
    </html>
  );
}
