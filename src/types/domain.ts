import { ISODateString } from "./dates";
import { BidHistoryItem } from "./bid";

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

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  xUsername?: string;
  isAdmin?: boolean;
}