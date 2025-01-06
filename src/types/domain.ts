import { ISODateString } from "./dates";

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: ISODateString;
}

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

export type BidHistoryJson = {
  bidder: string;
  amount: number;
  timestamp: string;
}[];