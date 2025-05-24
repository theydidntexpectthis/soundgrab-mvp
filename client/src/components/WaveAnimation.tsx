import { cn } from "@/lib/utils";

interface WaveAnimationProps {
  className?: string;
  isPlaying?: boolean;
}

export function WaveAnimation({ className, isPlaying = true }: WaveAnimationProps) {
  return (
    <div className={cn("wave-animation", className, { "opacity-50": !isPlaying })}>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
    </div>
  );
}
