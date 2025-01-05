import { Card } from "@/components/ui/card";

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  buyNowPrice?: number;
  status: 'pending' | 'active' | 'sold' | 'featured';
}

interface PendingDomainsProps {
  domains: Domain[];
}

export const PendingDomains = ({ domains }: PendingDomainsProps) => {
  if (domains.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Pending Auctions</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-4 backdrop-blur-sm bg-yellow-50/50 border-yellow-200">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{domain.name}</h3>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-600">Starting Price: $ {domain.currentBid.toLocaleString()}</p>
              {domain.buyNowPrice && (
                <p className="text-sm text-gray-600">Buy Now: $ {domain.buyNowPrice.toLocaleString()}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};