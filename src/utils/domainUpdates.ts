import { supabase } from "@/integrations/supabase/client";
import { Domain, BidHistoryItem } from "@/types/domain";
import { toISOString } from "@/types/dates";

export const setupWebSocket = (onUpdate: (domains: Domain[]) => void) => {
  const channel = supabase
    .channel('public:domains')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'domains' 
      }, 
      async () => {
        const domains = await getDomains();
        onUpdate(domains);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*');

    if (error) {
      console.error('Error fetching domains:', error);
      return [];
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      currentBid: d.current_bid,
      endTime: toISOString(d.end_time),
      bidHistory: Array.isArray(d.bid_history) ? d.bid_history.map((bid: any) => ({
        bidder: String(bid.bidder),
        amount: Number(bid.amount),
        timestamp: String(bid.timestamp)
      })) : [],
      status: d.status,
      currentBidder: d.current_bidder,
      bidTimestamp: d.bid_timestamp ? toISOString(d.bid_timestamp) : undefined,
      buyNowPrice: d.buy_now_price,
      finalPrice: d.final_price,
      purchaseDate: d.purchase_date ? toISOString(d.purchase_date) : undefined,
      featured: d.featured,
      createdAt: d.created_at ? toISOString(d.created_at) : undefined,
      listedBy: d.listed_by,
      isFixedPrice: d.is_fixed_price
    }));
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
};

export const updateDomain = async (domain: Domain) => {
  try {
    const { error } = await supabase
      .from('domains')
      .update({
        current_bid: domain.currentBid,
        current_bidder: domain.currentBidder,
        bid_history: domain.bidHistory,
        bid_timestamp: domain.bidTimestamp,
        status: domain.status,
        final_price: domain.finalPrice,
        purchase_date: domain.purchaseDate
      })
      .eq('id', domain.id);

    if (error) {
      console.error('Error updating domain:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving domain:', error);
    throw error;
  }
};