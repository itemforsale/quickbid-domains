import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { Domain } from "@/types/domain";

interface DomainCardProps {
  domain: Domain;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onFeature?: (id: number) => void;
  onDelete?: (id: number) => void;
  isPending?: boolean;
}

export const DomainCard = ({
  domain,
  onApprove,
  onReject,
  onFeature,
  onDelete,
  isPending = false
}: DomainCardProps) => {
  return (
    <Card className="p-4 backdrop-blur-sm bg-white/50">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{domain.name}</h3>
          {domain.featured && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-500" />
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {isPending ? "Starting" : "Current"} Price: ${domain.currentBid}
        </p>
        {domain.buyNowPrice && (
          <p className="text-sm text-gray-600">Buy Now Price: ${domain.buyNowPrice}</p>
        )}
        <div className={`flex ${isPending ? "" : "justify-end"} gap-2 mt-4`}>
          {isPending ? (
            <>
              <Button
                onClick={() => onApprove?.(domain.id)}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={() => onReject?.(domain.id)}
                variant="destructive"
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => onFeature?.(domain.id)}
                variant="outline"
                size="sm"
                className={domain.featured ? "bg-yellow-100 text-yellow-700" : ""}
              >
                <Star className={`h-4 w-4 mr-2 ${domain.featured ? "fill-yellow-500" : ""}`} />
                {domain.featured ? "Featured" : "Feature"}
              </Button>
              <Button
                onClick={() => onDelete?.(domain.id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Listing
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
