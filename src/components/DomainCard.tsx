import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { DomainHeader } from "./domain/DomainHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DomainCardProps {
  domain: string;
  price: number;
  onPurchase: () => void;
  featured?: boolean;
  createdAt?: Date;
  listedBy?: string;
}

export const DomainCard = ({
  domain,
  price,
  onPurchase,
  featured,
  createdAt,
  listedBy = 'Anonymous',
}: DomainCardProps) => {
  const { user } = useUser();

  const handlePurchase = () => {
    if (!user) {
      toast.error("Please login to purchase the domain");
      return;
    }
    if (user.username === listedBy) {
      toast.error("You cannot buy your own domain listing");
      return;
    }
    onPurchase();
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in",
      featured 
        ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 shadow-yellow-100' 
        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
    )}>
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <DomainHeader
            domain={domain}
            isNew={false}
            featured={featured}
            listedBy={listedBy}
          />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-bold text-gray-900">$ {price.toLocaleString()}</p>
            </div>
            <button
              onClick={handlePurchase}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};