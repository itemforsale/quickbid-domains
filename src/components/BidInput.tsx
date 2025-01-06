import { BidLabel } from "./bid/BidLabel";
import { BidAmountInput } from "./bid/BidAmountInput";
import { PlaceBidButton } from "./bid/PlaceBidButton";
import { useState } from "react";
import { toast } from "sonner";

interface BidInputProps {
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onBid: () => void;
  currentBid: number;
  minimumBid?: number;
}

export const BidInput = ({
  bidAmount,
  onBidAmountChange,
  onBid,
  currentBid,
  minimumBid,
}: BidInputProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actualMinimumBid = minimumBid || currentBid + 1;

  const handleBid = async () => {
    if (bidAmount < actualMinimumBid) {
      toast.error(`Bid must be at least $${actualMinimumBid}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onBid();
      toast.success("Bid placed successfully!");
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <BidLabel minimumBid={actualMinimumBid} />
        <BidAmountInput 
          bidAmount={bidAmount}
          onBidAmountChange={onBidAmountChange}
        />
      </div>
      <PlaceBidButton 
        onBid={handleBid}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};