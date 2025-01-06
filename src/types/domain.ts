import { Json } from "@/integrations/supabase/types";

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: string;
}

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: Date;
  bidHistory: BidHistoryItem[];
  status: 'pending' | 'active' | 'featured' | 'sold';
  currentBidder?: string;
  bidTimestamp?: Date;
  buyNowPrice?: number;
  finalPrice?: number;
  purchaseDate?: Date;
  featured?: boolean;
  createdAt?: Date;
  listedBy: string;
  isFixedPrice?: boolean;
}

export interface SupabaseDomain {
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