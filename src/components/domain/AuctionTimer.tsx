import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

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
      const minutesLeft = differenceInMinutes(endTime, now);
      const secondsLeft = differenceInMinutes(endTime, now) <= 0 
        ? differenceInSeconds(endTime, now) 
        : (differenceInSeconds(endTime, now) % 60);

      if (minutesLeft <= 0 && secondsLeft <= 0) {
        setTimeLeft("Ended");
        onEnd();
        return;
      }

      setIsEnding(minutesLeft <= 10);
      setTimeLeft(`${minutesLeft}m ${secondsLeft}s`);
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