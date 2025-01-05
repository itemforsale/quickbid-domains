export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: Date;
  bidHistory: {
    bidder: string;
    amount: number;
    timestamp: Date;
  }[];
  status: 'pending' | 'active' | 'sold';
  currentBidder?: string;
  bidTimestamp?: Date;
  buyNowPrice?: number;
  finalPrice?: number;
  purchaseDate?: Date;
  featured?: boolean;
  createdAt: Date;
  listedBy: string;
}