import { useState, useEffect } from "react";
import { useInterval } from "react-use";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { formatDistanceToNow } from "date-fns";

interface DomainCardProps {
  domain: string;
  initialPrice: number;
  endTime: Date;
  onBid: (amount: number) => void;
  currentBid: number;
  currentBidder?: string;
  bidTimestamp?: Date;
}

export const DomainCard = ({
  domain,
  initialPrice,
  endTime,
  onBid,
  currentBid,
  currentBidder,
  bidTimestamp,
}: DomainCardProps) => {
  const { user } = useUser();
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState(currentBid + 10);

  const calculateTimeLeft = () => {
    const difference = endTime.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return "Auction ended";
    }

    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);

  const handleBid = () => {
    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }
    if (bidAmount <= currentBid) {
      toast.error("Bid must be higher than current bid");
      return;
    }
    onBid(bidAmount);
    toast.success("Bid placed successfully!");
    setBidAmount(bidAmount + 10);
  };

  const formatBidder = (username: string) => {
    return `@${username}`;
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Active
            </span>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{domain}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Time Left</p>
            <p className="text-lg font-mono font-bold text-gray-900">{timeLeft}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Bid</p>
              <p className="text-lg font-bold text-gray-900">${currentBid}</p>
            </div>
            {currentBidder && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Highest Bidder</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatBidder(currentBidder)}
                  {bidTimestamp && (
                    <span className="text-xs text-gray-500 block">
                      {formatDistanceToNow(bidTimestamp, { addSuffix: true })}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleBid}
              className="bg-primary hover:bg-primary/90 text-white transition-colors"
            >
              Place Bid
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};