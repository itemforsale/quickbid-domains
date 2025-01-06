import { ISODateString } from "./dates";

export interface BidHistoryItem {
  bidder: string;
  amount: number;
  timestamp: ISODateString;
}

export interface Bid extends BidHistoryItem {
  timestamp: ISODateString;
}