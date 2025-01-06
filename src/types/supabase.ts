import { Json } from "@/integrations/supabase/types";

export type SupabaseDomain = {
  id: number;
  name: string;
  current_bid: number;
  end_time: string;
  bid_history: Json;
  status: 'pending' | 'active' | 'sold' | 'featured';
  current_bidder?: string;
  bid_timestamp?: string;
  buy_now_price?: number;
  final_price?: number;
  purchase_date?: string;
  featured?: boolean;
  created_at?: string;
  listed_by: string;
  is_fixed_price?: boolean;
};

export const mapSupabaseToDomain = (domain: SupabaseDomain) => {
  return {
    id: domain.id,
    name: domain.name,
    currentBid: domain.current_bid,
    endTime: new Date(domain.end_time),
    bidHistory: Array.isArray(domain.bid_history) ? domain.bid_history : [],
    status: domain.status,
    currentBidder: domain.current_bidder,
    bidTimestamp: domain.bid_timestamp ? new Date(domain.bid_timestamp) : undefined,
    buyNowPrice: domain.buy_now_price,
    finalPrice: domain.final_price,
    purchaseDate: domain.purchase_date ? new Date(domain.purchase_date) : undefined,
    featured: domain.featured,
    createdAt: domain.created_at ? new Date(domain.created_at) : new Date(),
    listedBy: domain.listed_by,
    isFixedPrice: domain.is_fixed_price
  };
};

export const mapDomainToSupabase = (domain: Partial<Domain>) => {
  return {
    name: domain.name,
    current_bid: domain.currentBid,
    end_time: domain.endTime?.toISOString(),
    bid_history: domain.bidHistory || [],
    status: domain.status,
    current_bidder: domain.currentBidder,
    bid_timestamp: domain.bidTimestamp?.toISOString(),
    buy_now_price: domain.buyNowPrice,
    final_price: domain.finalPrice,
    purchase_date: domain.purchaseDate?.toISOString(),
    featured: domain.featured,
    created_at: domain.createdAt?.toISOString(),
    listed_by: domain.listedBy,
    is_fixed_price: domain.isFixedPrice
  };
};