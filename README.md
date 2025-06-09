# Zodiac NFT Avatar Generator

A Next.js application that generates unique zodiac-based NFT avatars using AI and allows minting them on the Solana blockchain.

## Features

- 🔮 **Zodiac Detection**: Automatically calculates zodiac signs from birth dates
- 🎨 **AI Avatar Generation**: Uses OpenAI DALL-E to create unique cosmic avatars
- 🌟 **Rarity System**: Complex rarity calculations based on birth date factors
- 🔗 **Solana Integration**: Wallet connection and NFT minting capabilities
- 🎯 **Responsive UI**: Modern cosmic-themed interface with glass morphism effects

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Blockchain**: Solana Web3.js with Wallet Adapter
- **AI**: OpenAI GPT-4 and DALL-E 3
- **Styling**: Tailwind CSS with custom cosmic theme
- **UI Components**: Radix UI primitives
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# OpenAI API Configuration (Server-side only - secure)
OPENAI_API_KEY=your_openai_api_key_here

# Solana Configuration (Client-side safe)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# NFT Configuration
NEXT_PUBLIC_NFT_PRICE_SOL=0.05
```

**Important Security Note**: 
- `OPENAI_API_KEY` is server-side only and secure
- Never use `NEXT_PUBLIC_` prefix for sensitive API keys
- The OpenAI service runs on a secure API route

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How to Test

### 1. Basic Zodiac Detection
1. Enter any birth date in the date picker
2. Verify the zodiac sign is correctly detected
3. Check that rarity factors are calculated and displayed

### 2. AI Avatar Generation
1. After detecting a zodiac sign, optionally add customization preferences
2. Click "Generate AI Avatar" button
3. Wait for the AI to generate a unique avatar (requires OpenAI API key)
4. Verify the avatar displays with metadata

**Note**: Without an OpenAI API key, you'll see a helpful error message. Add your key to `.env.local` to test avatar generation.

### 3. Wallet Connection
1. Install a Solana wallet (Phantom, Solflare, etc.)
2. Click "Connect Wallet" button
3. Approve the connection
4. Verify wallet address is displayed

### 4. NFT Minting (Demo)
1. Complete steps 1-3 above
2. Click "Mint NFT" button
3. The demo will simulate the minting process
4. In production, this would create an actual NFT on Solana

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # Server-side API routes
│   │   └── generate-avatar/ # Secure avatar generation endpoint
│   ├── globals.css        # Global styles with cosmic theme
│   ├── layout.tsx         # Root layout with wallet provider
│   └── page.tsx           # Main page component
├── components/
│   ├── providers/         # Context providers
│   │   └── wallet-provider.tsx
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── avatar-preview.tsx # Avatar display component
│   ├── birth-date-input.tsx # Date picker with zodiac detection
│   ├── zodiac-display.tsx # Zodiac info display
│   └── zodiac-nft-layout.tsx # Main layout component
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── zodiac-calculator.ts # Zodiac calculation logic
│   └── zodiac-data.ts     # Zodiac signs data
└── services/
    └── zodiac-ai-service.ts # OpenAI integration (server-side)
```

## Architecture

### Security-First Design
- **Server-side AI Processing**: OpenAI API calls happen on secure server routes
- **Environment Variable Protection**: Sensitive keys never exposed to client
- **API Route Pattern**: `/api/generate-avatar` handles all AI operations

### Client-Server Flow
1. User enters birth date → Zodiac calculated client-side
2. User clicks generate → Client sends data to `/api/generate-avatar`
3. Server processes with OpenAI → Returns generated avatar
4. Client displays result → User can mint NFT

## Zodiac System Features

### Zodiac Detection
- Accurate date range calculations for all 12 signs
- Handles year transitions (Capricorn spanning Dec-Jan)
- Birth date metadata including season, special dates, leap years

### Rarity Calculation
- **Birth Date Rarity**: Based on leap years, special dates, day of year
- **Element Balance**: Fire, Earth, Air, Water alignment with seasons
- **Cusp Proximity**: Higher rarity for dates near sign boundaries
- **Seasonal Alignment**: Cosmic alignment factors

### AI Avatar Generation
- Character prompt generation using GPT-4
- Custom image prompts for DALL-E 3
- Personalized descriptions
- NFT metadata generation with attributes

## Solana Integration

### Wallet Support
- Phantom Wallet
- Solflare Wallet
- Automatic connection handling
- Network switching (devnet/mainnet)

### NFT Minting (Planned)
- Metaplex NFT creation
- On-chain metadata storage
- Royalty configuration
- Collection management

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Environment Variables

- `OPENAI_API_KEY`: Required for AI avatar generation (server-side)
- `NEXT_PUBLIC_SOLANA_NETWORK`: Solana network (devnet/mainnet-beta)
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Custom RPC endpoint (optional)

### Testing Without OpenAI API Key

The application will gracefully handle missing API keys:
- Zodiac detection works without API key
- Wallet connection works without API key
- Avatar generation shows helpful error message
- All other features remain functional

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Add `OPENAI_API_KEY=your_key_here` to `.env.local`
   - Restart the development server

2. **Wallet connection issues**
   - Ensure you have a Solana wallet installed
   - Try refreshing the page
   - Check browser console for errors

3. **Avatar generation slow**
   - DALL-E 3 can take 10-30 seconds
   - Don't refresh the page during generation
   - Check your OpenAI API usage limits

## License

This project is for educational and demonstration purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



## 🔐 Security & Transparency Statement

This project is fully open-source and intended for educational and entertainment purposes on the Solana blockchain. 

- No user data is stored or tracked.
- No wallet credentials or private information are collected.
- Wallet access is only requested for minting NFTs with user approval via standard Solana wallet flow.
- All contract interactions are transparent and on-chain.
- Codebase is MIT licensed and available for public auditing.

We fully support Phantom’s commitment to user safety and welcome any technical review or audit.




## Support

For issues and questions, please check the existing issues or create a new one in the GitHub repository. 