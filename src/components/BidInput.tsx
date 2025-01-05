import { Button } from "@/components/ui/button";

interface BidInputProps {
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onBid: () => void;
}

export const BidInput = ({ bidAmount, onBidAmountChange, onBid }: BidInputProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => onBidAmountChange(Number(e.target.value))}
        className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Button
        onClick={onBid}
        className="bg-primary hover:bg-primary/90 text-white transition-colors"
      >
        Place Bid
      </Button>
    </div>
  );
};