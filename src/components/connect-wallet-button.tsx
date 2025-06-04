"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SigninMessage } from "@/lib/signin-message";
import { toast } from "sonner";
import bs58 from "bs58";

export default function ConnectWalletButton() {
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signInAttempted, setSignInAttempted] = useState(false);

  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSignIn = useCallback(async () => {
    if (!publicKey || !signMessage || signInAttempted) return;

    // Start the process
    setIsSigningIn(true);
    setSignInAttempted(true);

    try {
      // Generate nonce and create message
      const nonce = generateNonce();
      const signinMessage = new SigninMessage({
        publicKey: publicKey.toString(),
        nonce: nonce
      });

      // Sign the message with complete error suppression
      const messageBytes = new TextEncoder().encode(signinMessage.message);
      
      console.log('Attempting to sign message...');
      
      // Wrap signMessage in a promise that never rejects
      const signResult = await new Promise<Uint8Array | null>((resolve) => {
        signMessage(messageBytes)
          .then((signature) => {
            console.log('Sign successful');
            resolve(signature);
          })
          .catch((signError) => {
            console.log('🛡️ Sign failed (handled):', signError?.message || signError);
            
            // Handle user rejection silently
            if (signError?.code === 4001 || 
                signError?.message?.includes?.("User rejected") || 
                signError?.message?.includes?.("denied") ||
                signError?.name?.includes?.("WalletSignMessageError")) {
              
              console.log('🛡️ User rejected - showing toast');
              toast.error("Connection cancelled", {
                description: "You cancelled the wallet connection."
              });
              
              // Disconnect wallet
              disconnect().catch(() => {
                // Ignore disconnect errors
              });
            } else {
              console.log('🛡️ Other sign error - showing generic toast');
              toast.error("Connection error", {
                description: "An error occurred while connecting to wallet. Please try again."
              });
            }
            
            // Always resolve with null instead of rejecting
            resolve(null);
          });
      });
      
      // If signing was successful
      if (signResult) {
        console.log("Signature:", bs58.encode(signResult));
        console.log("Message:", signinMessage.message);
        
        setIsAuthenticated(true);
        toast.success("Wallet connected successfully!", {
          description: "You can now mint NFTs."
        });
      }
      
    } catch (outerError) {
      // This should never happen now, but just in case
      console.log('🛡️ Outer error caught:', outerError);
      toast.error("Unexpected error", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSigningIn(false);
    }
  }, [publicKey, signMessage, signInAttempted, disconnect]);

  // Auto-trigger sign message when wallet connects (only once)
  useEffect(() => {
    const autoSignIn = () => {
      if (connected && publicKey && !isAuthenticated && !isSigningIn && !signInAttempted) {
        console.log('Auto-triggering sign in...');
        
        // Call handleSignIn but don't await it and don't handle errors
        // All errors are handled inside handleSignIn now
        handleSignIn().catch((error) => {
          console.log('Auto sign-in error suppressed:', error);
          // Do nothing - all errors handled in handleSignIn
        });
      }
    };

    autoSignIn();
  }, [connected, publicKey, isAuthenticated, isSigningIn, signInAttempted, handleSignIn]);

  // Reset sign-in attempt when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setSignInAttempted(false);
      setIsAuthenticated(false);
    }
  }, [connected]);

  const handleConnectClick = () => {
    setSignInAttempted(false); // Reset attempt flag when manually connecting
    setVisible(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    setIsAuthenticated(false);
    setSignInAttempted(false);
    toast.success("Wallet connection disconnected");
  };

  // If signing in, show loading state
  if (connected && publicKey && isSigningIn) {
    return (
      <Button
        disabled
        className="bg-blue-600 text-white cursor-not-allowed"
      >
        <Icon icon="lucide:loader-2" className="w-4 h-4 mr-2 animate-spin" />
        Signing In...
      </Button>
    );
  }

  // If connected but rejected signing, show retry button
  if (connected && publicKey && signInAttempted && !isAuthenticated && !isSigningIn) {
    return (
      <Button
        onClick={() => {
          setSignInAttempted(false);
          console.log('Retry button clicked');
          
          // Call handleSignIn without awaiting or error handling
          handleSignIn().catch((error) => {
            console.log('Retry sign-in error suppressed:', error);
            // All errors handled in handleSignIn
          });
        }}
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Icon icon="lucide:refresh-cw" className="w-4 h-4 mr-2" />
        Retry Sign
      </Button>
    );
  }

  // If authenticated, show connected state
  if (connected && publicKey && isAuthenticated) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
      >
        <Icon icon="lucide:check-circle" className="w-4 h-4 mr-2" />
        {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
      </Button>
    );
  }

  // Default state - not connected
  return (
    <Button
      onClick={handleConnectClick}
      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
    >
      <Icon icon="lucide:wallet" className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}