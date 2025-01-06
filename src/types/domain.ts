interface ComplexDate {
  value: {
    iso: string;
  };
}

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  endTime: Date | string | ComplexDate;
  bidHistory: {
    bidder: string;
    amount: number;
    timestamp: Date;
  }[];
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