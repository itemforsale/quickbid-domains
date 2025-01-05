import { Button } from "@/components/ui/button";

interface BidInputProps {
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onBid: () => void;
}

export const BidInput = ({ 
  bidAmount,
  onBidAmountChange,
  onBid 
}: BidInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <label htmlFor="bidAmount" className="text-sm text-gray-500 mb-1 block">
          Your Maximum Bid
        </label>
        <input
          id="bidAmount"
          type="number"
          value={bidAmount}
          onChange={(e) => onBidAmountChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button
        onClick={onBid}
        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
      >
        Place Bid
      </Button>
    </div>
  );
};