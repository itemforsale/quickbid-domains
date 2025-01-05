import { formatDistanceToNow } from "date-fns";

interface Bid {
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface BidHistoryProps {
  bids: Bid[];
  formatBidder: (username: string) => string;
}

export const BidHistory = ({ bids, formatBidder }: BidHistoryProps) => {
  if (!bids || bids.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Bid History</p>
      <div className="space-y-2">
        {bids.map((bid, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatBidder(bid.bidder)} (${bid.amount})
            </span>
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};