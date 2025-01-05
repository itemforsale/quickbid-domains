import { Button } from "@/components/ui/button";

interface PlaceBidButtonProps {
  onBid: () => void;
}

export const PlaceBidButton = ({ onBid }: PlaceBidButtonProps) => (
  <Button 
    onClick={onBid}
    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
  >
    Place Bid
  </Button>
);