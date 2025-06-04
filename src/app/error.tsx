'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('App Router Error:', error)
    
    // Check if it's a wallet-related error
    if (
      error.message?.includes('User rejected') ||
      error.message?.includes('WalletSignMessageError') ||
      error.name?.includes('WalletSignMessageError')
    ) {
      // Redirect to home page instead of showing error
      console.log('Wallet error detected, redirecting to home');
      router.push('/');
      return;
    }
  }, [error, router])

  // Don't render error page for wallet errors
  if (
    error.message?.includes('User rejected') ||
    error.message?.includes('WalletSignMessageError') ||
    error.name?.includes('WalletSignMessageError')
  ) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
} 