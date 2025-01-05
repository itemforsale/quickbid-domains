import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { BidHistory } from "./BidHistory";
import { BidInput } from "./BidInput";
import { CurrentBid } from "./CurrentBid";
import { DomainHeader } from "./domain/DomainHeader";
import { AuctionTimer } from "./domain/AuctionTimer";
import { BidCount } from "./domain/BidCount";
import { BuyNowSection } from "./domain/BuyNowSection";
import { cn } from "@/lib/utils";

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
  createdAt?: Date;
  listedBy?: string;
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
  createdAt,
  listedBy = 'Anonymous',
}: DomainCardProps) => {
  const { user } = useUser();
  const [isEnded, setIsEnded] = useState(false);
  const [bidAmount, setBidAmount] = useState(currentBid + 10);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (createdAt && createdAt instanceof Date) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setIsNew(createdAt > fiveMinutesAgo);

      const timeUntilNotNew = createdAt.getTime() + 5 * 60 * 1000 - Date.now();
      if (timeUntilNotNew > 0) {
        const timer = setTimeout(() => setIsNew(false), timeUntilNotNew);
        return () => clearTimeout(timer);
      }
    }
  }, [createdAt]);

  const handleBid = () => {
    if (isEnded) {
      toast.error("This auction has ended");
      return;
    }
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
    if (isEnded) {
      toast.error("This auction has ended");
      return;
    }
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
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in",
      featured 
        ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 shadow-yellow-100' 
        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
    )}>
      <div className="relative p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <DomainHeader
              domain={domain}
              isNew={isNew}
              featured={featured}
              isEnded={isEnded}
              listedBy={listedBy}
            />
            <AuctionTimer 
              endTime={endTime}
              onEnd={() => setIsEnded(true)}
            />
          </div>
          
          <BidCount count={bidHistory.length} />

          <div className="flex flex-col gap-3">
            <CurrentBid
              currentBid={currentBid}
              currentBidder={currentBidder}
              bidTimestamp={bidTimestamp}
              formatBidder={formatBidder}
            />
            
            {!isEnded && buyNowPrice && (
              <BuyNowSection
                price={buyNowPrice}
                onBuyNow={handleBuyNow}
              />
            )}
            
            {!isEnded && (
              <BidInput
                bidAmount={bidAmount}
                onBidAmountChange={setBidAmount}
                onBid={handleBid}
              />
            )}

            <BidHistory bids={bidHistory} formatBidder={formatBidder} />
          </div>
        </div>
      </div>
    </Card>
  );
};