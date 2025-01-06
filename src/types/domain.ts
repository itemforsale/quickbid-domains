import { ISODateString } from "./dates";

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: string;
}

export type DomainStatus = 'pending' | 'active' | 'featured' | 'sold';

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: string;
  bidHistory: BidHistoryItem[];
  status: DomainStatus;
  currentBidder?: string;
  bidTimestamp?: string;
  buyNowPrice?: number;
  finalPrice?: number;
  purchaseDate?: string;
  featured?: boolean;
  createdAt?: string;
  listedBy: string;
  isFixedPrice?: boolean;
}

export interface DomainDB {
  id: number;
  name: string;
  current_bid: number;
  end_time: string;
  bid_history: BidHistoryItem[];
  status: DomainStatus;
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