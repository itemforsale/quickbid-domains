import { DomainCard } from "@/components/DomainCard";
import { Domain } from "@/types/domain";

interface ActiveAuctionsProps {
  domains: Domain[];
  onBid: (domainId: number, amount: number) => void;
  onBuyNow: (domainId: number) => void;
}

export const ActiveAuctions = ({ domains, onBid, onBuyNow }: ActiveAuctionsProps) => {
  if (domains.length === 0) return null;
  
  // Sort domains to show featured ones first
  const sortedDomains = [...domains].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Active Auctions</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        {sortedDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain.name}
            initialPrice={domain.currentBid}
            endTime={domain.endTime}
            currentBid={domain.currentBid}
            currentBidder={domain.currentBidder}
            bidTimestamp={domain.bidTimestamp}
            bidHistory={domain.bidHistory}
            buyNowPrice={domain.buyNowPrice}
            onBid={(amount) => onBid(domain.id, amount)}
            onBuyNow={() => onBuyNow(domain.id)}
            featured={domain.featured}
          />
        ))}
      </div>
    </div>
  );
};