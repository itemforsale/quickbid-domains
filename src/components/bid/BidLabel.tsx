interface BidLabelProps {
  minimumBid: number;
}

export const BidLabel = ({ minimumBid }: BidLabelProps) => (
  <label htmlFor="bidAmount" className="text-sm text-gray-500 mb-1 block">
    Your Maximum Bid (Minimum $ {minimumBid.toLocaleString()})
  </label>
);