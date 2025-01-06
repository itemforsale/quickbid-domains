import { ISODateString } from "./dates";
import { Json } from "@/integrations/supabase/types";

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: ISODateString;
}

// Helper type to ensure BidHistoryItem can be stored as Json
export type BidHistoryJson = {
  bidder: string;
  amount: number;
  timestamp: string;
}[];

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: ISODateString;
  bidHistory: BidHistoryItem[];
  status: 'pending' | 'active' | 'featured' | 'sold';
  currentBidder?: string;
  bidTimestamp?: ISODateString;
  buyNowPrice?: number;
  finalPrice?: number;
  purchaseDate?: ISODateString;
  featured?: boolean;
  createdAt?: ISODateString;
  listedBy: string;
  isFixedPrice?: boolean;
}