import { useState } from "react";
import { useInterval } from "react-use";
import { toast } from "sonner";
import { Hammer, Star, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { BidHistory } from "./BidHistory";
import { BidInput } from "./BidInput";
import { CurrentBid } from "./CurrentBid";

interface Bid {
  bidder: string;
  amount: number;
  proxyAmount?: number;
  timestamp: Date;
}

interface DomainCardProps {
  domain: string;
  initialPrice: number;
  endTime: Date;
  onBid: (amount: number, proxyAmount?: number) => void;
  currentBid: number;
  currentBidder?: string;
  bidTimestamp?: Date;
  bidHistory?: Bid[];
  buyNowPrice?: number;
  onBuyNow?: () => void;
  featured?: boolean;
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
  buyNowPrice,
  onBuyNow,
  featured,
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
    onBid(currentBid + 10, bidAmount);
    toast.success("Bid placed successfully!");
    setBidAmount(bidAmount + 10);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to purchase the domain");
      return;
    }
    if (onBuyNow) {
      onBuyNow();
      toast.success("Domain purchased successfully!");
    }
  };

  const formatBidder = (username: string) => {
    return `@${username}`;
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in
      ${featured 
        ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 shadow-yellow-100' 
        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
      }`}>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse">
                  Active
                </span>
                {featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {domain}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Hammer className="w-4 h-4" />
                <span className="text-sm font-medium">{bidHistory.length} bids</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                <Timer className="w-4 h-4" />
                Time Left
              </p>
              <p className="text-lg font-mono font-bold text-gray-900 group-hover:text-primary transition-colors">
                {timeLeft}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <CurrentBid
              currentBid={currentBid}
              currentBidder={currentBidder}
              bidTimestamp={bidTimestamp}
              formatBidder={formatBidder}
            />
            
            {buyNowPrice && (
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 group-hover:bg-green-100/50 transition-colors">
                <span className="text-sm font-medium text-green-700">Buy Now Price:</span>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-green-700">${buyNowPrice}</span>
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}
            
            <BidInput
              bidAmount={bidAmount}
              onBidAmountChange={setBidAmount}
              onBid={handleBid}
            />

            <BidHistory bids={bidHistory} formatBidder={formatBidder} />
          </div>
        </div>
      </div>
    </Card>
  );
};
