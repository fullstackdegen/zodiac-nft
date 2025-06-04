'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { toast } from 'sonner'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught error:', error, errorInfo)
    
    // Don't show toast for hydration errors or wallet rejection errors
    if (error.message?.includes('Hydration') || 
        error.message?.includes('Text content does not match') ||
        error.message?.includes('User rejected') ||
        error.message?.includes('WalletSignMessageError') ||
        error.name?.includes('WalletSignMessageError')) {
      return
    }

    // Show toast for other errors
    toast.error('Application Error', {
      description: 'Something went wrong. The page will reload automatically.',
      duration: 5000,
    })
    
    // Auto-reload after a short delay to recover
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  componentDidMount() {
    // Listen for unhandled errors
    const handleUnhandledError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error)
      
      // Don't show toast for script errors, hydration issues, or wallet errors
      if (event.error?.message?.includes('Hydration') ||
          event.error?.message?.includes('Script error') ||
          event.error?.message?.includes('User rejected') ||
          event.error?.message?.includes('WalletSignMessageError') ||
          event.error?.name?.includes('WalletSignMessageError') ||
          event.filename?.includes('chrome-extension')) {
        // Prevent default error page for wallet errors
        event.preventDefault();
        return
      }

      // Prevent default error page
      event.preventDefault();

      toast.error('Unexpected Error', {
        description: 'An unexpected error occurred. Please refresh the page.',
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload(),
        },
        duration: 8000,
      })
    }

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Don't show toast for wallet rejections (already handled)
      if (event.reason?.message?.includes('User rejected') ||
          event.reason?.code === 4001 ||
          event.reason?.name?.includes('WalletSignMessageError') ||
          event.reason?.name?.includes('WalletError') ||
          String(event.reason).includes('WalletSignMessageError') ||
          String(event.reason).includes('User rejected')) {
        // Prevent default error page for wallet errors
        event.preventDefault();
        return
      }

      // Prevent default error page for handled network errors too
      event.preventDefault();

      toast.error('Network Error', {
        description: 'A network request failed. Please check your connection and try again.',
        duration: 6000,
      })
    }

    window.addEventListener('error', handleUnhandledError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleUnhandledError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              The page will reload automatically to recover.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reload Now
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 