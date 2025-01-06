export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: string;
}

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: string;
  bidHistory: BidHistoryItem[];
  status: 'pending' | 'active' | 'featured' | 'sold';
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

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  xUsername?: string;
  isAdmin?: boolean;
}