import { formatDistanceToNow } from "date-fns";

interface CurrentBidProps {
  currentBid: number;
  currentBidder?: string;
  bidTimestamp?: Date;
  formatBidder: (username: string) => string;
}

export const CurrentBid = ({
  currentBid,
  currentBidder,
  bidTimestamp,
  formatBidder,
}: CurrentBidProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Current Bid</p>
        <p className="text-lg font-bold text-gray-900">${currentBid}</p>
      </div>
      {currentBidder && (
        <div className="text-right">
          <p className="text-sm text-gray-500">Highest Bidder</p>
          <p className="text-sm font-medium text-gray-900">
            {formatBidder(currentBidder)} (${currentBid})
          </p>
          {bidTimestamp && (
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(bidTimestamp), { addSuffix: true })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};