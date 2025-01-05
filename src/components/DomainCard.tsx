import { useState } from "react";
import { useInterval } from "react-use";
import { toast } from "sonner";
import { Hammer, Star } from "lucide-react";
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
    <Card className={`p-6 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg animate-fade-in
      ${featured ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 shadow-yellow-100' : 'bg-white/50 border-gray-200'}`}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Active
              </span>
              {featured && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  Featured
                </span>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{domain}</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <Hammer className="w-4 h-4" />
              <span className="text-sm">{bidHistory.length} bids</span>
            </div>
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
          
          {buyNowPrice && (
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Buy Now Price:</span>
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-green-700">${buyNowPrice}</span>
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
    </Card>
  );
};