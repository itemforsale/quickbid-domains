import { Json } from "@/integrations/supabase/types";

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: Date;
  bidHistory: BidHistoryItem[];
  status: 'pending' | 'active' | 'sold' | 'featured';
  currentBidder?: string;
  bidTimestamp?: Date;
  buyNowPrice?: number;
  finalPrice?: number;
  purchaseDate?: Date;
  featured?: boolean;
  createdAt: Date;
  listedBy: string;
  isFixedPrice?: boolean;
}

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: Date;
}