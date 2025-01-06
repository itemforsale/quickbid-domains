import { DomainCard } from "@/components/DomainCard";
import { Domain } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActiveAuctionsProps {
  onBid: (domainId: number, amount: number) => void;
  onBuyNow: (domainId: number) => void;
}

export const ActiveAuctions = ({ onBid, onBuyNow }: ActiveAuctionsProps) => {
  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['active-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .in('status', ['active', 'featured'])
        .order('featured', { ascending: false });

      if (error) {
        toast.error('Failed to load domains');
        return [];
      }

      return data.map(d => ({
        id: d.id,
        name: d.name,
        currentBid: d.current_bid,
        endTime: d.end_time,
        bidHistory: d.bid_history as { bidder: string; amount: number; timestamp: string }[],
        status: d.status,
        currentBidder: d.current_bidder,
        bidTimestamp: d.bid_timestamp,
        buyNowPrice: d.buy_now_price,
        finalPrice: d.final_price,
        purchaseDate: d.purchase_date,
        featured: d.featured,
        createdAt: d.created_at,
        listedBy: d.listed_by,
        isFixedPrice: d.is_fixed_price
      }));
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (!domains.length) return null;
  
  const featuredFixedPriceDomains = domains.filter(d => d.isFixedPrice && d.featured);
  const regularDomains = domains.filter(d => !d.isFixedPrice);
  
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
                endTime={new Date(domain.endTime)}
                currentBid={domain.currentBid}
                currentBidder={domain.currentBidder}
                bidTimestamp={domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined}
                bidHistory={domain.bidHistory.map(bid => ({
                  bidder: bid.bidder,
                  amount: bid.amount,
                  timestamp: new Date(bid.timestamp)
                }))}
                buyNowPrice={domain.buyNowPrice}
                onBid={(amount) => onBid(domain.id, amount)}
                onBuyNow={() => onBuyNow(domain.id)}
                featured={domain.featured}
                createdAt={domain.createdAt ? new Date(domain.createdAt) : undefined}
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
                endTime={new Date(domain.endTime)}
                currentBid={domain.currentBid}
                currentBidder={domain.currentBidder}
                bidTimestamp={domain.bidTimestamp ? new Date(domain.bidTimestamp) : undefined}
                bidHistory={domain.bidHistory.map(bid => ({
                  bidder: bid.bidder,
                  amount: bid.amount,
                  timestamp: new Date(bid.timestamp)
                }))}
                buyNowPrice={domain.buyNowPrice}
                onBid={(amount) => onBid(domain.id, amount)}
                onBuyNow={() => onBuyNow(domain.id)}
                featured={domain.featured}
                createdAt={domain.createdAt ? new Date(domain.createdAt) : undefined}
                listedBy={domain.listedBy}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};