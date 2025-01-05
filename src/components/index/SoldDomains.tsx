import { Card } from "@/components/ui/card";
import { Domain } from "@/types/domain";

interface SoldDomainsProps {
  domains: Domain[];
}

export const SoldDomains = ({ domains }: SoldDomainsProps) => {
  if (domains.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recently Sold</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-4 backdrop-blur-sm bg-white/50 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{domain.name}</h3>
                <span className="text-green-600 font-medium">${domain.finalPrice}</span>
              </div>
              <p className="text-sm text-gray-500">
                Sold to @{domain.currentBidder}
              </p>
              <p className="text-xs text-gray-400">
                {domain.purchaseDate?.toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};