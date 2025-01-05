import { Button } from "@/components/ui/button";

interface BidInputProps {
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onBid: () => void;
  currentBid: number;
}

export const BidInput = ({ 
  bidAmount,
  onBidAmountChange,
  onBid,
  currentBid
}: BidInputProps) => {
  const minimumBid = currentBid + 1;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label htmlFor="bidAmount" className="text-sm text-gray-500 mb-1 block">
          Your Maximum Bid (Minimum $ {minimumBid.toLocaleString()})
        </label>
        <input
          id="bidAmount"
          type="number"
          min={minimumBid}
          value={bidAmount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value >= minimumBid) {
              onBidAmountChange(value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button
        onClick={onBid}
        disabled={bidAmount < minimumBid}
        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50"
      >
        Place Bid
      </Button>
    </div>
  );
};