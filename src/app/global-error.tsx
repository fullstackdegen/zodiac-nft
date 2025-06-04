'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global error:', error)
    
    // Don't show toast for hydration errors or development errors
    if (error.message?.includes('Hydration') || 
        error.message?.includes('Text content does not match') ||
        process.env.NODE_ENV === 'development') {
      return
    }

    // Show user-friendly error toast
    toast.error('Something went wrong', {
      description: 'An unexpected error occurred. Please refresh the page and try again.',
      action: {
        label: 'Refresh',
        onClick: () => window.location.reload(),
      },
      duration: 10000,
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 