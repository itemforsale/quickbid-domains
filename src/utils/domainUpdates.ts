import { supabase } from "@/integrations/supabase/client";
import { Domain, BidHistoryItem } from "@/types/domain";
import { Json } from "@/integrations/supabase/types";

interface SupabaseDomain {
  id: number;
  name: string;
  current_bid: number;
  end_time: string;
  bid_history: BidHistoryItem[];
  status: 'pending' | 'active' | 'featured' | 'sold';
  current_bidder?: string;
  bid_timestamp?: string;
  buy_now_price?: number;
  final_price?: number;
  purchase_date?: string;
  featured?: boolean;
  created_at?: string;
  listed_by: string;
  is_fixed_price?: boolean;
}

export const mapSupabaseToDomain = (domain: SupabaseDomain): Domain => ({
  id: domain.id,
  name: domain.name,
  currentBid: domain.current_bid,
  endTime: domain.end_time,
  bidHistory: domain.bid_history || [],
  status: domain.status,
  currentBidder: domain.current_bidder,
  bidTimestamp: domain.bid_timestamp,
  buyNowPrice: domain.buy_now_price,
  finalPrice: domain.final_price,
  purchaseDate: domain.purchase_date,
  featured: domain.featured,
  createdAt: domain.created_at,
  listedBy: domain.listed_by,
  isFixedPrice: domain.is_fixed_price
});

export const mapDomainToSupabase = (domain: Domain): Omit<SupabaseDomain, 'id'> => ({
  name: domain.name,
  current_bid: domain.currentBid,
  end_time: domain.endTime,
  bid_history: domain.bidHistory,
  status: domain.status,
  current_bidder: domain.currentBidder,
  bid_timestamp: domain.bidTimestamp,
  buy_now_price: domain.buyNowPrice,
  final_price: domain.finalPrice,
  purchase_date: domain.purchaseDate,
  featured: domain.featured,
  created_at: domain.createdAt,
  listed_by: domain.listedBy,
  is_fixed_price: domain.isFixedPrice
});

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

    return (data as SupabaseDomain[]).map(mapSupabaseToDomain);
  } catch (error) {
    console.error('Error loading domains:', error);
    return [];
  }
};

export const updateDomains = async (domain: Domain) => {
  try {
    const supabaseDomain = mapDomainToSupabase(domain);
    
    const { error } = await supabase
      .from('domains')
      .upsert({
        ...supabaseDomain,
        id: domain.id
      });

    if (error) {
      console.error('Error updating domain:', error);
    }
  } catch (error) {
    console.error('Error saving domain:', error);
  }
};