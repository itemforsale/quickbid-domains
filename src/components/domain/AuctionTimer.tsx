import { useState } from "react";
import { useInterval } from "react-use";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuctionTimerProps {
  endTime: Date;
  onEnd: () => void;
}

export const AuctionTimer = ({ endTime, onEnd }: AuctionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [flash, setFlash] = useState(false);

  // Flash animation interval
  useInterval(() => {
    if (isEndingSoon) {
      setFlash(prev => !prev);
    }
  }, 500);

  const calculateTimeLeft = () => {
    const difference = endTime.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      onEnd();
      setIsEndingSoon(false);
      return "Auction ended";
    }

    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Check if less than 10 minutes remaining
    setIsEndingSoon(minutes < 10);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);

  return (
    <div className="text-right">
      <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
        <Timer className="w-4 h-4" />
        {timeLeft === "Auction ended" ? 'Ended' : 'Time Left'}
      </p>
      <div className="flex items-center gap-2">
        <p className={cn(
          "text-lg font-mono font-bold transition-colors",
          isEndingSoon ? "text-red-600" : "text-gray-900 group-hover:text-primary"
        )}>
          {timeLeft}
        </p>
        {isEndingSoon && timeLeft !== "Auction ended" && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            flash ? "bg-red-100 text-red-600" : "bg-transparent"
          )}>
            Ending Soon!
          </span>
        )}
      </div>
    </div>
  );
};