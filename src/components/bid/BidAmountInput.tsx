interface BidAmountInputProps {
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
}

export const BidAmountInput = ({ bidAmount, onBidAmountChange }: BidAmountInputProps) => (
  <input
    id="bidAmount"
    type="number"
    value={bidAmount}
    onChange={(e) => onBidAmountChange(Number(e.target.value))}
    className="w-full p-2 border border-gray-300 rounded-md"
  />
);