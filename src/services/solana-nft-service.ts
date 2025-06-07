import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { ZodiacNFTMetadata } from "./zodiac-ai-service";
import UploadFileToBlockChain from "@/lib/arweave";


// Proper wallet interface that includes all needed properties
interface SigningWallet {
  publicKey: PublicKey | null;
  connected: boolean;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFTMintResult {
  signature: string;
  mintAddress: string;
  tokenAccount: string;
  name: string;
  symbol: string;
  uri: string;
  explorerUrl: string;
  supply: number;
}

export interface NFTMintError {
  error: string;
  details?: string;
  code?: string;
}

/**
 * Uploads metadata for an NFT to Arweave blockchain
 */
export async function UploadMetadata(
  metadata: NFTMetadata
): Promise<{ uri: string }> {
  try {
    // Step 1: Upload the image to Arweave if it's a data URL
    let imageUrl = metadata.image;

    if (metadata.image.startsWith("data:")) {
      console.log("Uploading image to Arweave...");
      // Convert data URL to Blob
      const response = await fetch(metadata.image);
      const blob = await response.blob();

      // Upload the image to Arweave
      const arweaveImageUrl = await UploadFileToBlockChain(blob, blob.type);

      if (!arweaveImageUrl) {
        throw new Error("Failed to upload image to Arweave");
      }

      console.log("Image uploaded to Arweave:", arweaveImageUrl);
      // Replace the data URL with the Arweave URL
      imageUrl = arweaveImageUrl;
    }

    // Step 2: Create the metadata with the Arweave image URL
    const finalMetadata = {
      ...metadata,
      image: imageUrl,
    };

    // Step 3: Upload the metadata JSON to Arweave
    console.log("Uploading metadata to Arweave...");
    const metadataBlob = new Blob([JSON.stringify(finalMetadata, null, 2)], {
      type: "application/json",
    });

    const metadataUrl = await UploadFileToBlockChain(
      metadataBlob,
      "application/json"
    );

    if (!metadataUrl) {
      throw new Error("Failed to upload metadata to Arweave");
    }

    console.log("Metadata uploaded to Arweave:", metadataUrl);
    return { uri: metadataUrl };
  } catch (error) {
    console.error("Error uploading to Arweave:", error);
    throw error;
  }
}

export class SolanaNFTService {
  private connection: Connection;
  private network: "devnet" | "mainnet-beta";

  constructor(network: "devnet" | "mainnet-beta" = "devnet") {
    this.network = network;

    // Create connection using environment variable or fallback to default cluster URLs
    let endpoint: string;
    
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      // Use custom RPC endpoint from environment variable
      endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
      // console.log("Using custom Solana RPC endpoint:", endpoint);
    } else {
      // Fallback to default cluster URLs
      endpoint = network === "mainnet-beta"
        ? clusterApiUrl("mainnet-beta")
        : clusterApiUrl("devnet");
      console.log("Using default Solana cluster endpoint:", endpoint);
    }

    this.connection = new Connection(endpoint, "confirmed");
  }

  /**
   * Convert ZodiacNFTMetadata to NFTMetadata format
   */
  private convertToNFTMetadata(avatarData: ZodiacNFTMetadata): NFTMetadata {
    return {
      name: avatarData.name,
      description: avatarData.description,
      image: avatarData.image,
      attributes: [
        {
          trait_type: "Zodiac Sign",
          value: avatarData.zodiacSign,
        },
        {
          trait_type: "Element",
          value: avatarData.element,
        },
        {
          trait_type: "Season",
          value:
            avatarData.attributes.find((attr) => attr.trait_type === "Season")
              ?.value || "Unknown",
        },
        {
          trait_type: "Rarity Score",
          value: `${avatarData.rarityScore.toFixed(1)}%`,
        },
        {
          trait_type: "Birth Date",
          value: avatarData.birthDate,
        },
        {
          trait_type: "Cosmic Alignment",
          value: avatarData.cosmicAlignment,
        },
        ...avatarData.attributes.filter((attr) =>
          attr.trait_type.startsWith("Rare Feature")
        ),
      ],
    };
  }

  /**
   * Mint an NFT using Metaplex SDK
   */
  async mintNFT(
    wallet: SigningWallet,
    avatarData: ZodiacNFTMetadata,
    onProgress?: (step: number, message: string) => void
  ): Promise<NFTMintResult | NFTMintError> {
    try {
      if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
        return {
          error: "Wallet not connected or doesn't support signing",
          details: "Please connect a compatible Solana wallet to mint an NFT",
        };
      }

      console.log("Starting NFT mint process...");
      console.log("Wallet:", wallet.publicKey.toString());

      // Check wallet balance first
      const balance = await this.connection.getBalance(wallet.publicKey);
      const requiredBalance = 0.01 * LAMPORTS_PER_SOL; // Estimate 0.01 SOL needed

      if (balance < requiredBalance) {
        return {
          error: "Insufficient SOL balance",
          details: `You need at least 0.01 SOL to mint an NFT. Current balance: ${(
            balance / LAMPORTS_PER_SOL
          ).toFixed(4)} SOL`,
          code: "INSUFFICIENT_FUNDS",
        };
      }

      // Create a wallet adapter interface for Metaplex that matches what it expects
      const walletAdapterForMetaplex = {
        publicKey: wallet.publicKey,
        signMessage: wallet.signMessage?.bind(wallet),
        signTransaction: wallet.signTransaction.bind(wallet),
        signAllTransactions: wallet.signAllTransactions?.bind(wallet),
      };

      // Initialize Metaplex with wallet adapter identity
      const metaplex = Metaplex.make(this.connection).use(
        walletAdapterIdentity(walletAdapterForMetaplex)
      );

      // Step 1: Prepare metadata
      onProgress?.(1, "Preparing NFT metadata...");
      const nftMetadata = this.convertToNFTMetadata(avatarData);

      // Step 2: Upload to Arweave and get metadata URI
      onProgress?.(2, "Uploading image and metadata to Arweave...");
      const { uri } = await UploadMetadata(nftMetadata);

      // Step 3: Mint the NFT using the metadata URI
      onProgress?.(3, "Minting NFT on Solana blockchain...");
      const result = await metaplex.nfts().create({
        uri,
        name: avatarData.name,
        symbol: "ZODIAC",
        sellerFeeBasisPoints: 500, // 5% royalty
        tokenOwner: wallet.publicKey,
      });

      const { nft, response } = result;

      const explorerUrl =
        this.network === "mainnet-beta"
          ? `https://explorer.solana.com/address/${nft.address.toString()}`
          : `https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`;

      console.log("NFT minted successfully!");
      console.log("Mint address:", nft.address.toString());
      console.log("Transaction signature:", response.signature);

      onProgress?.(4, "NFT minted successfully!");

      return {
        signature: response.signature,
        mintAddress: nft.address.toString(),
        tokenAccount: nft.address.toString(), // For NFTs, mint address is the token account
        name: avatarData.name,
        symbol: "ZODIAC",
        uri: uri,
        explorerUrl,
        supply: 1,
      };
    } catch (error) {
      console.error("Error minting NFT:", error);

      let errorMessage = "Unknown error occurred";
      let errorCode: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;

        // Handle specific errors
        if (
          error.message.includes("insufficient funds") ||
          error.message.includes("Insufficient")
        ) {
          errorMessage = "Insufficient SOL balance for transaction";
          errorCode = "INSUFFICIENT_FUNDS";
        } else if (
          error.message.includes("User rejected") ||
          error.message.includes("rejected")
        ) {
          errorMessage = "Transaction was rejected by user";
          errorCode = "USER_REJECTED";
        } else if (error.message.includes("Arweave")) {
          errorMessage = "Failed to upload to Arweave. Please try again.";
          errorCode = "ARWEAVE_ERROR";
        } else if (error.message.includes("Blockhash not found")) {
          errorMessage = "Network congestion, please try again";
          errorCode = "NETWORK_ERROR";
        }
      }

      return {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
        code: errorCode,
      };
    }
  }

  /**
   * Get the estimated cost of minting an NFT
   */
  async getEstimatedMintCost(): Promise<{
    rentExemption: number;
    transactionFee: number;
    totalCost: number;
    formattedCost: string;
  }> {
    try {
      // Metaplex estimates (these are approximate)
      const rentExemption = 0.003 * LAMPORTS_PER_SOL; // ~0.003 SOL for accounts
      const transactionFee = 0.0015 * LAMPORTS_PER_SOL; // ~0.0015 SOL for transaction fees
      const totalCost = rentExemption + transactionFee;

      return {
        rentExemption: rentExemption,
        transactionFee: transactionFee,
        totalCost: totalCost,
        formattedCost: `${(totalCost / LAMPORTS_PER_SOL).toFixed(4)} SOL`,
      };
    } catch (error) {
      console.error("Error estimating mint cost:", error);
      // Return default estimates
      return {
        rentExemption: 0.003 * LAMPORTS_PER_SOL,
        transactionFee: 0.0015 * LAMPORTS_PER_SOL,
        totalCost: 0.0045 * LAMPORTS_PER_SOL,
        formattedCost: "~0.0045 SOL",
      };
    }
  }

  /**
   * Check if wallet has sufficient balance for minting
   */
  async checkWalletBalance(walletAddress: string): Promise<{
    balance: number;
    formattedBalance: string;
    hasSufficientFunds: boolean;
    requiredAmount: number;
  }> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      const { totalCost } = await this.getEstimatedMintCost();

      return {
        balance,
        formattedBalance: `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`,
        hasSufficientFunds: balance >= totalCost,
        requiredAmount: totalCost,
      };
    } catch (error) {
      console.error("Error checking wallet balance:", error);
      return {
        balance: 0,
        formattedBalance: "0 SOL",
        hasSufficientFunds: false,
        requiredAmount: 0.0045 * LAMPORTS_PER_SOL,
      };
    }
  }

  /**
   * Get network info
   */
  getNetworkInfo() {
    return {
      network: this.network,
      endpoint: this.connection.rpcEndpoint,
      commitment: this.connection.commitment,
    };
  }
}
