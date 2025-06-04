import { PublicKey } from "@solana/web3.js";

export class SigninMessage {
  publicKey: PublicKey;
  nonce: string;

  constructor(message: { publicKey: string; nonce: string }) {
    this.publicKey = new PublicKey(message.publicKey);
    this.nonce = message.nonce;
  }

  get message() {
    return `Welcome to Zodiac NFT! 

By signing this message, you are simply connecting your wallet to our platform. 

✅ No funds will be deducted
✅ No transactions will be made  
✅ Only your wallet address will be used

Wallet: ${this.publicKey.toString()}
Nonce: ${this.nonce}`;
  }

  static decode(message: string) {
    const lines = message.split("\n");
    const walletLine = lines.find(line => line.startsWith("Wallet: "));
    const nonceLine = lines.find(line => line.startsWith("Nonce: "));
    
    const publicKey = walletLine ? walletLine.replace("Wallet: ", "") : "";
    const nonce = nonceLine ? nonceLine.replace("Nonce: ", "") : "";
    
    return new SigninMessage({ publicKey, nonce });
  }
} 