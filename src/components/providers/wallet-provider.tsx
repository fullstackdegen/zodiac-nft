'use client'

import React, { useMemo, useCallback, useEffect } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { toast } from 'sonner'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletContextProviderProps {
  children: React.ReactNode
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  // Get network from environment or default to devnet
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet
  
  // Get RPC endpoint from environment or use default
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    }
    return clusterApiUrl(network)
  }, [network])

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  // Setup global error prevention for wallet errors
  useEffect(() => {
    const originalError = window.onerror;
    const originalUnhandledRejection = window.onunhandledrejection;
    const originalConsoleError = console.error;

    // Super aggressive error suppression
    window.onerror = (message, source, lineno, colno, error) => {
      const messageStr = typeof message === 'string' ? message : '';
      console.log('🛡️ Global error intercepted:', { messageStr, error });
      
      // Check if it's a wallet-related error - be very broad
      if (
        messageStr.includes('User rejected') ||
        messageStr.includes('WalletSignMessageError') ||
        messageStr.includes('rejected the request') ||
        error?.message?.includes?.('User rejected') ||
        error?.message?.includes?.('WalletSignMessageError') ||
        error?.message?.includes?.('rejected the request') ||
        error?.name?.includes?.('WalletSignMessageError') ||
        error?.name?.includes?.('WalletError') ||
        source?.includes?.('wallet') ||
        source?.includes?.('solana')
      ) {
        console.log('🛡️ Wallet error BLOCKED from Next.js error page');
        return true; // Completely prevent error propagation
      }
      
      // Call original handler for other errors
      if (originalError) {
        return originalError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };

    // Super aggressive promise rejection suppression
    window.onunhandledrejection = (event) => {
      console.log('🛡️ Global promise rejection intercepted:', event.reason);
      
      // Check if it's wallet-related - be very broad
      const reason = event.reason;
      const reasonStr = String(reason);
      
      if (
        reason?.message?.includes?.('User rejected') ||
        reason?.message?.includes?.('WalletSignMessageError') ||
        reason?.message?.includes?.('rejected the request') ||
        reason?.name?.includes?.('WalletSignMessageError') ||
        reason?.name?.includes?.('WalletError') ||
        reason?.code === 4001 ||
        reasonStr.includes('User rejected') ||
        reasonStr.includes('WalletSignMessageError') ||
        reasonStr.includes('rejected the request') ||
        reasonStr.includes('wallet') ||
        reasonStr.includes('solana')
      ) {
        console.log('🛡️ Wallet promise rejection BLOCKED from Next.js error page');
        event.preventDefault(); // Completely prevent error propagation
        event.stopPropagation();
        event.stopImmediatePropagation();
        return true;
      }
      
      // Call original handler for other rejections
      if (originalUnhandledRejection) {
        return originalUnhandledRejection.call(window, event);
      }
    };

    // Also suppress console.error for wallet errors to be extra sure
    console.error = (...args) => {
      // Check if any argument contains wallet error indicators
      const isWalletError = args.some(arg => {
        const argStr = String(arg);
        return (
          argStr.includes('User rejected') ||
          argStr.includes('WalletSignMessageError') ||
          argStr.includes('rejected the request') ||
          argStr.includes('StandardWalletAdapter') ||
          argStr.includes('WalletProviderBase') ||
          argStr.includes('signMessage') ||
          argStr.includes('_StandardWalletAdapter_signMessage') ||
          argStr.includes('useMemo[signMessage]') ||
          argStr.includes('ConnectWalletButton') ||
          argStr.includes('wallet-adapter') ||
          argStr.includes('@solana') ||
          (arg?.name && arg.name.includes('WalletSignMessageError')) ||
          (arg?.message && arg.message.includes('User rejected'))
        );
      });
      
      if (isWalletError) {
        console.log('🛡️ Console error suppressed for wallet error:', args[0]?.message || args[0]);
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    // Cleanup function
    return () => {
      window.onerror = originalError;
      window.onunhandledrejection = originalUnhandledRejection;
      console.error = originalConsoleError;
    };
  }, []);

  // Global error handler for wallet operations
  const onError = useCallback((error: WalletError) => {
    console.log('🛡️ Wallet Provider onError:', error?.message || error);
    
    // Don't show toast for user rejected errors - they're handled in connect-wallet-button
    if (error.message?.includes('User rejected') || 
        error.message?.includes('denied') ||
        error.name === 'WalletConnectionError' ||
        error.name === 'WalletSignMessageError' ||
        (error as { code?: number })?.code === 4001) {
      console.log('🛡️ User rejected error - not showing toast');
      return;
    }

    // Handle different types of wallet errors with user-friendly messages
    let errorMessage = 'Unknown wallet error occurred';
    let description = 'Please try again or contact support.';

    if (error.message?.includes('Wallet not found')) {
      errorMessage = 'Wallet not found';
      description = 'Please install a Solana wallet like Phantom or Solflare.';
    } else if (error.message?.includes('Failed to connect')) {
      errorMessage = 'Connection failed';
      description = 'Unable to connect to wallet. Please try again.';
    } else if (error.message?.includes('Insufficient funds')) {
      errorMessage = 'Insufficient funds';
      description = 'You need more SOL to complete this transaction.';
    } else if (error.message?.includes('Transaction failed')) {
      errorMessage = 'Transaction failed';
      description = 'Your transaction could not be processed. Please try again.';
    } else if (error.message?.includes('Network error')) {
      errorMessage = 'Network error';
      description = 'Unable to connect to Solana network. Please check your connection.';
    } else if (error.message) {
      errorMessage = 'Wallet error';
      description = error.message;
    }

    toast.error(errorMessage, {
      description: description,
      duration: 5000,
    });
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}