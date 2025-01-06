import { DomainCard } from "@/components/DomainCard";
import { Domain } from "@/types/domain";
import { parseDate } from "@/utils/dateUtils";

interface ActiveAuctionsProps {
  domains: Domain[];
  onBid: (domainId: number, amount: number) => void;
  onBuyNow: (domainId: number) => void;
}

export const ActiveAuctions = ({ domains, onBid, onBuyNow }: ActiveAuctionsProps) => {
  if (domains.length === 0) return null;
  
  const featuredFixedPriceDomains = domains.filter(d => d.isFixedPrice && d.featured);
  const regularDomains = domains.filter(d => !d.isFixedPrice)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  
  return (
    <div className="space-y-8">
      {featuredFixedPriceDomains.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Featured Domains For Sale</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {featuredFixedPriceDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain.name}
                initialPrice={domain.currentBid}
                endTime={parseDate(domain.endTime)}
                currentBid={domain.currentBid}
                currentBidder={domain.currentBidder}
                bidTimestamp={domain.bidTimestamp ? parseDate(domain.bidTimestamp) : undefined}
                bidHistory={domain.bidHistory.map(bid => ({
                  bidder: bid.bidder,
                  amount: bid.amount,
                  timestamp: parseDate(bid.timestamp)
                }))}
                buyNowPrice={domain.buyNowPrice}
                onBid={(amount) => onBid(domain.id, amount)}
                onBuyNow={() => onBuyNow(domain.id)}
                featured={domain.featured}
                createdAt={domain.createdAt ? parseDate(domain.createdAt) : undefined}
                listedBy={domain.listedBy}
              />
            ))}
          </div>
        </div>
      )}

      {regularDomains.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Active Auctions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {regularDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain.name}
                initialPrice={domain.currentBid}
                endTime={parseDate(domain.endTime)}
                currentBid={domain.currentBid}
                currentBidder={domain.currentBidder}
                bidTimestamp={domain.bidTimestamp ? parseDate(domain.bidTimestamp) : undefined}
                bidHistory={domain.bidHistory.map(bid => ({
                  bidder: bid.bidder,
                  amount: bid.amount,
                  timestamp: parseDate(bid.timestamp)
                }))}
                buyNowPrice={domain.buyNowPrice}
                onBid={(amount) => onBid(domain.id, amount)}
                onBuyNow={() => onBuyNow(domain.id)}
                featured={domain.featured}
                createdAt={domain.createdAt ? parseDate(domain.createdAt) : undefined}
                listedBy={domain.listedBy}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};