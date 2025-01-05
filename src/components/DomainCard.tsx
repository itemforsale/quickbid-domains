import { useState } from "react";
import { useInterval } from "react-use";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { BidHistory } from "./BidHistory";
import { BidInput } from "./BidInput";
import { CurrentBid } from "./CurrentBid";

interface Bid {
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface DomainCardProps {
  domain: string;
  initialPrice: number;
  endTime: Date;
  onBid: (amount: number) => void;
  currentBid: number;
  currentBidder?: string;
  bidTimestamp?: Date;
  bidHistory?: Bid[];
}

export const DomainCard = ({
  domain,
  initialPrice,
  endTime,
  onBid,
  currentBid,
  currentBidder,
  bidTimestamp,
  bidHistory = [],
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
          <CurrentBid
            currentBid={currentBid}
            currentBidder={currentBidder}
            bidTimestamp={bidTimestamp}
            formatBidder={formatBidder}
          />
          
          <BidInput
            bidAmount={bidAmount}
            onBidAmountChange={setBidAmount}
            onBid={handleBid}
          />

          <BidHistory bids={bidHistory} formatBidder={formatBidder} />
        </div>
      </div>
    </Card>
  );
};