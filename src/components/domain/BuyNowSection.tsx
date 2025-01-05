import { Button } from "@/components/ui/button";

interface BuyNowSectionProps {
  price: number;
  onBuyNow: () => void;
}

export const BuyNowSection = ({ price, onBuyNow }: BuyNowSectionProps) => (
  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 group-hover:bg-green-100/50 transition-colors">
    <span className="text-sm font-medium text-green-700">Buy Now Price:</span>
    <div className="flex gap-2 items-center">
      <span className="font-bold text-green-700">$ {price.toLocaleString()}</span>
      <Button
        onClick={onBuyNow}
        variant="outline"
        className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
      >
        Buy Now
      </Button>
    </div>
  </div>
);