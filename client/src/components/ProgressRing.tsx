import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
}

export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 4,
  className,
  bgColor = "hsl(var(--surface))",
  progressColor = "hsl(var(--primary))",
  showPercentage = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="progress-ring__circle"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring__circle"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
