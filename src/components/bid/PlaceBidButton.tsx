import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PlaceBidButtonProps {
  onBid: () => void;
  isSubmitting?: boolean;
}

export const PlaceBidButton = ({ onBid, isSubmitting }: PlaceBidButtonProps) => (
  <Button 
    onClick={onBid}
    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Placing Bid...
      </>
    ) : (
      'Place Bid'
    )}
  </Button>
);