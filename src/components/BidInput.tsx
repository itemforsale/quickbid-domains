import { BidLabel } from "./bid/BidLabel";
import { BidAmountInput } from "./bid/BidAmountInput";
import { PlaceBidButton } from "./bid/PlaceBidButton";

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
  currentBid,
}: BidInputProps) => {
  const minimumBid = currentBid + 1;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <BidLabel minimumBid={minimumBid} />
        <BidAmountInput 
          bidAmount={bidAmount}
          onBidAmountChange={onBidAmountChange}
        />
      </div>
      <PlaceBidButton onBid={onBid} />
    </div>
  );
};