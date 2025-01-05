import { Hammer } from "lucide-react";

interface BidCountProps {
  count: number;
}

export const BidCount = ({ count }: BidCountProps) => (
  <div className="flex items-center gap-2 mt-1 text-gray-600">
    <Hammer className="w-4 h-4" />
    <span className="text-sm font-medium">{count} bids</span>
  </div>
);