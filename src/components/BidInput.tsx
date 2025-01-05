import { Button } from "@/components/ui/button";

interface BidInputProps {
  bidAmount: number;
  proxyBidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onProxyBidAmountChange: (amount: number) => void;
  onBid: () => void;
}

export const BidInput = ({ 
  bidAmount, 
  proxyBidAmount,
  onBidAmountChange, 
  onProxyBidAmountChange,
  onBid 
}: BidInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="bidAmount" className="text-sm text-gray-500 mb-1 block">
            Bid Amount
          </label>
          <input
            id="bidAmount"
            type="number"
            value={bidAmount}
            onChange={(e) => onBidAmountChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="proxyBid" className="text-sm text-gray-500 mb-1 block">
            Max Proxy Bid (Optional)
          </label>
          <input
            id="proxyBid"
            type="number"
            value={proxyBidAmount}
            onChange={(e) => onProxyBidAmountChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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