"use client";

import { forwardRef, useRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { SolanaNFTService } from "@/services/solana-nft-service";
import CircularText from "./circular-text";

interface ZodiacSignDisplay {
  sign: string;
  symbol: string;
  iconName: string;
  color: string;
  element: string;
  dates: string;
}

interface MintCardProps {
  zodiacSigns: ZodiacSignDisplay[];
  id: string;
}

export interface MintCardRef {
  focusSelect: () => void;
}

const MintCard = forwardRef<MintCardRef, MintCardProps>(
  ({ zodiacSigns: displaySigns, id }, ref) => {
    const selectTriggerRef = useRef<HTMLButtonElement>(null);
    const { publicKey, signTransaction } = useWallet();

    const [selectedSign, setSelectedSign] = useState<string>("");
    const [userPreferences, setUserPreferences] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
    const [birthDate, setBirthDate] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showProgressDialog, setShowProgressDialog] = useState(false);
    const [mintProgress, setMintProgress] = useState<string>("");
    const [progressValue, setProgressValue] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const progressSteps = [
      {
        step: 1,
        title: "Preparing",
        description: "Setting up your cosmic journey...",
        text: "INIT",
      },
      {
        step: 2,
        title: "AI Magic",
        description: "Creating your personalized avatar...",
        text: "CREATING*",
      },
      {
        step: 3,
        title: "Uploading",
        description: "Storing in the decentralized cosmos...",
        text: "*UPLOADING*TO*ARWEAVE*",
      },
      {
        step: 4,
        title: "Minting",
        description: "Minting your NFT on Solana...",
        text: "*MINTING*ON*SOLANA",
      },
      {
        step: 5,
        title: "Complete",
        description: "Your cosmic NFT is ready! ✨",
        text: "DONE",
      },
    ];

    const languageOptions = [
      { value: "English", label: "English", flag: "🇺🇸" },
      { value: "Spanish", label: "Español", flag: "🇪🇸" },
      { value: "French", label: "Français", flag: "🇫🇷" },
      { value: "German", label: "Deutsch", flag: "🇩🇪" },
      { value: "Italian", label: "Italiano", flag: "🇮🇹" },
      { value: "Portuguese", label: "Português", flag: "🇵🇹" },
      { value: "Russian", label: "Русский", flag: "🇷🇺" },
      { value: "Japanese", label: "日本語", flag: "🇯🇵" },
      { value: "Korean", label: "한국어", flag: "🇰🇷" },
      { value: "Chinese", label: "中文", flag: "🇨🇳" },
    ];

    useImperativeHandle(ref, () => ({
      focusSelect: () => {
        selectTriggerRef.current?.click();
      },
    }));

    const handleSignSelection = (signValue: string) => {
      setSelectedSign(signValue);
    };

    const handleMintClick = () => {
      if (!selectedSign) {
        toast.error("Zodiac sign required", {
          description: "Please select a zodiac sign first!",
        });
        return;
      }

      if (!publicKey) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet first!",
        });
        return;
      }

      setShowConfirmDialog(true);
    };

    const handleConfirmMint = async () => {
      setShowConfirmDialog(false);
      setIsLoading(true);
      setShowProgressDialog(true);
      setCurrentStep(1);
      setProgressValue(15);
      setMintProgress("Setting up your cosmic journey...");

      try {
        // Find the selected zodiac sign data
        const selectedZodiacData = displaySigns.find(
          (zodiac) => zodiac.sign === selectedSign
        );

        if (!selectedZodiacData) {
          throw new Error("Selected zodiac sign not found");
        }

        // Step 2: AI Generation
        setCurrentStep(2);
        setProgressValue(35);
        setMintProgress("Creating your personalized avatar...");

        // Generate NFT with AI via API endpoint using selected zodiac sign
        const response = await fetch("/api/generate-avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zodiacSign: selectedSign,
            zodiacData: {
              sign: selectedZodiacData.sign,
              symbol: selectedZodiacData.symbol,
              element: selectedZodiacData.element,
              dates: selectedZodiacData.dates,
            },
            userPreferences: userPreferences.trim() || undefined,
            language: selectedLanguage,
            birthDate: birthDate.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate avatar");
        }

        const { avatar: nftMetadata } = await response.json();

        // Step 3: Uploading
        setCurrentStep(3);
        setProgressValue(65);
        setMintProgress("Storing in the decentralized cosmos...");

        // Mint NFT on Solana
        const nftService = new SolanaNFTService("devnet");
        const wallet = {
          publicKey,
          connected: true,
          signTransaction,
        };

        const result = await nftService.mintNFT(
          wallet as {
            publicKey: typeof publicKey;
            connected: boolean;
            signTransaction: typeof signTransaction;
          },
          nftMetadata,
          (step: number, message: string) => {
            // Update progress based on step
            if (message.includes("Minting") || message.includes("blockchain")) {
              setCurrentStep(4);
              setProgressValue(85);
              setMintProgress("Minting your NFT on Solana...");
            }
          }
        );

        if ("error" in result) {
          throw new Error(result.error);
        }

        // Step 5: Complete
        setCurrentStep(5);
        setProgressValue(100);
        setMintProgress("Your cosmic NFT is ready! ✨");

        // Wait a bit to show completion
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Show success message
        toast.success("NFT Successfully Created! 🎉", {
          description: `${result.name} - Click to view on Solana Explorer`,
          action: {
            label: "View on Explorer",
            onClick: () => window.open(result.explorerUrl, "_blank"),
          },
          duration: 10000,
        });
      } catch (error) {
        console.error("Mint error:", error);
        toast.error("Mint Operation Failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred during minting",
        });
      } finally {
        setIsLoading(false);
        setShowProgressDialog(false);
        setMintProgress("");
        setProgressValue(0);
        setCurrentStep(0);
      }
    };

    return (
      <>
        <div className="flex justify-center" id={id}  >
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-6 space-y-3">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-4">
                <Icon icon="lucide:wand-2" className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Your Cosmic Portal
              </CardTitle>

              <p className="text-gray-500 font-light">
                Unlock the stars within
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon
                    icon="jam:universe"
                    className="w-4 h-4 mr-1.25 text-primary"
                  />
                  Choose Your Sign
                </label>
                <Select onValueChange={handleSignSelection}>
                  <SelectTrigger
                    ref={selectTriggerRef}
                    className="border-gray-300 rounded-lg w-full"
                  >
                    <SelectValue placeholder="Discover your essence..." />
                  </SelectTrigger>
                  <SelectContent>
                    {displaySigns.map((zodiac) => (
                      <SelectItem key={zodiac.sign} value={zodiac.sign}>
                        <div className="flex items-center space-x-2">
                          <Icon
                            icon={zodiac.iconName}
                            className="w-4 h-4"
                            style={{ color: zodiac.color }}
                          />
                          <span>
                            {zodiac.sign} - {zodiac.dates}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon icon="lucide:settings" className="w-4 h-4 mr-1.25" />
                  Customize Preferences (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., mystical, warrior style, dark colors, futuristic..."
                  className="border-gray-300 rounded-lg"
                  value={userPreferences}
                  onChange={(e) => setUserPreferences(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon icon="lucide:language" className="w-4 h-4 mr-1.25" />
                  Choose Your Language
                </label>
                <Select onValueChange={setSelectedLanguage} defaultValue="English">
                  <SelectTrigger
                    className="border-gray-300 rounded-lg w-full"
                  >
                    <SelectValue placeholder="Select your language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        <div className="flex items-center space-x-2">
                          <span>{language.flag}</span>
                          <span>{language.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon icon="lucide:birthday-cake" className="w-4 h-4 mr-1.25" />
                  Enter Your Birth Date (Optional)
                </label>
                <Input
                  type="date"
                  className="border-gray-300 rounded-lg"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500">
                  Providing your birth date enables more accurate astrological analysis and personalization
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Price:</span>
                  <span className="text-2xl font-light text-gray-800 flex items-center space-x-1">
                    0.02
                    <div className="px-1">
                      <Icon icon="token-branded:solana" className="w-7 h-7" />
                    </div>
                  </span>
                </div>
              </div>

              <Button
                className="w-full rounded-lg"
                size="lg"
                onClick={handleMintClick}
                disabled={isLoading || !selectedSign}
              >
                {isLoading ? (
                  <>
                    <Icon
                      icon="lucide:loader-2"
                      className="w-4 h-4 mr-2 animate-spin"
                    />
                    Creating Your NFT...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:sparkles" className="w-4 h-4 mr-2" />
                    Mint Now
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center leading-relaxed font-light">
                One destiny per wallet. Terms apply.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Confirmation Dialog */}
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <Icon icon="lucide:sparkles" className="w-6 h-6 text-primary" />
                Confirm NFT Creation
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg  mt-6 font-medium text-gray-900 mb-1">
                      {selectedSign} Zodiac NFT
                    </div>
                    <p className="text-gray-600">
                      A unique, personalized NFT will be created exclusively for
                      you.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-semibold">
                        Total Cost
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 font-bold text-lg">
                          0.02
                        </span>
                        <Icon
                          icon="token-branded:solana"
                          className="w-5 h-5 text-gray-600"
                        />
                        <span className="text-gray-600 text-sm">
                          + gas fees
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      This transaction is permanent and will be recorded on the
                      Solana blockchain.
                    </div>
                  </div>

                  {userPreferences && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Your Style:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {userPreferences}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Language:
                      </span>
                      <span className="text-gray-600 ml-1 flex items-center gap-1">
                        {languageOptions.find(lang => lang.value === selectedLanguage)?.flag}
                        {languageOptions.find(lang => lang.value === selectedLanguage)?.label}
                      </span>
                    </div>
                  </div>

                  {birthDate && (
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Birth Date:
                        </span>
                        <span className="text-gray-600 ml-1">
                          {new Date(birthDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <Icon
                        icon="lucide:info"
                        className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                      />
                      <div className="text-sm text-amber-800">
                        <strong>Note:</strong> Each wallet can mint only one
                        NFT. This action cannot be undone.
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmMint}
                className="bg-primary hover:bg-primary/90 flex-1"
              >
                <Icon icon="lucide:zap" className="w-4 h-4 mr-2" />
                Create My NFT
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Progress Dialog */}
        <Dialog open={showProgressDialog} onOpenChange={() => {}}>
          <DialogContent className="max-w-md" showCloseButton={false}>
            <DialogHeader className="text-center">
              <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                <Icon
                  icon="lucide:sparkles"
                  className="w-6 h-6 text-primary animate-pulse"
                />
                Creating Your NFT
              </DialogTitle>
              <DialogDescription>
                Please wait while we craft your unique cosmic creation...
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-primary font-semibold">
                    {progressValue}%
                  </span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              {/* Current Step with CircularText */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <CircularText
                      text={progressSteps[currentStep - 1]?.text || "WAIT"}
                      spinDuration={currentStep === 5 ? 3 : 8}
                      onHover="speedUp"
                      className="w-24 h-24 text-primary text-lg font-bold -t"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {progressSteps[currentStep - 1]?.title || "Processing..."}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {progressSteps[currentStep - 1]?.description ||
                      mintProgress}
                  </p>
                </div>

                {/* Step indicator */}
                <div className="flex justify-center">
                  <Badge variant="secondary" className="px-3 py-1">
                    Step {currentStep} of {progressSteps.length}
                  </Badge>
                </div>
              </div>

              {/* Step List */}
              <div className="space-y-2">
                {progressSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      index + 1 < currentStep
                        ? "bg-green-50 text-green-700"
                        : index + 1 === currentStep
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        index + 1 < currentStep
                          ? "bg-green-200 text-green-800"
                          : index + 1 === currentStep
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Icon icon="lucide:check" className="w-3 h-3" />
                      ) : (
                        step.step
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

MintCard.displayName = "MintCard";

export default MintCard;
