import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface AuctionTimerProps {
  endTime: Date;
  onEnd: () => void;
}

export const AuctionTimer = ({ endTime, onEnd }: AuctionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft("Ended");
        onEnd();
        return;
      }

      // Calculate minutes and seconds
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setIsEnding(minutes <= 10);
      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  return (
    <div className="flex-shrink-0 text-right">
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm text-gray-500">Time Left</p>
        <div className={`flex items-center gap-2 ${isEnding ? 'animate-pulse' : ''}`}>
          {isEnding && (
            <Badge variant="destructive" className="animate-pulse">
              Ending Soon!
            </Badge>
          )}
          <span className={`font-mono font-medium ${isEnding ? 'text-red-600' : 'text-gray-900'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};