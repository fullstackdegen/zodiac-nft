import { SolanaNFTService } from '@/services/solana-nft-service'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, avatarData, network = 'devnet' } = body

    // Validate required data
    if (!walletAddress || !avatarData) {
      return NextResponse.json(
        { error: 'Missing required parameters: walletAddress and avatarData' },
        { status: 400 }
      )
    }

    // Create NFT service
    const nftService = new SolanaNFTService(network)
    
    // Check wallet balance
    const balanceInfo = await nftService.checkWalletBalance(walletAddress)
    if (!balanceInfo.hasSufficientFunds) {
      return NextResponse.json(
        { 
          error: 'Insufficient SOL balance',
          details: `Need at least ${(balanceInfo.requiredAmount / 1e9).toFixed(4)} SOL. Current balance: ${balanceInfo.formattedBalance}`,
          code: 'INSUFFICIENT_FUNDS'
        },
        { status: 400 }
      )
    }

    // Get mint cost estimation
    const mintCost = await nftService.getEstimatedMintCost()
    
    return NextResponse.json({ 
      success: true,
      walletBalance: balanceInfo,
      estimatedCost: mintCost,
      networkInfo: nftService.getNetworkInfo(),
      message: 'Ready to mint NFT. Please confirm the transaction in your wallet.'
    })

  } catch (error) {
    console.error('Error in mint-nft API:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to prepare NFT mint: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')
    const network = searchParams.get('network') || 'devnet'

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Create NFT service
    const nftService = new SolanaNFTService(network as 'devnet' | 'mainnet-beta')
    
    // Get wallet balance and mint cost
    const [balanceInfo, mintCost] = await Promise.all([
      nftService.checkWalletBalance(walletAddress),
      nftService.getEstimatedMintCost()
    ])
    
    return NextResponse.json({
      walletBalance: balanceInfo,
      estimatedCost: mintCost,
      networkInfo: nftService.getNetworkInfo()
    })

  } catch (error) {
    console.error('Error getting mint info:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to get mint info: ${errorMessage}` },
      { status: 500 }
    )
  }
} 