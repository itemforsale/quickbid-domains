import { Card } from "@/components/ui/card";
import { Domain } from "@/types/domain";

interface SoldDomainsProps {
  domains: Domain[];
}

export const SoldDomains = ({ domains }: SoldDomainsProps) => {
  if (domains.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Recently Sold</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-4 bg-background border-border">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-foreground">{domain.name}</h3>
                <span className="text-primary font-medium">${domain.finalPrice}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sold to @{domain.currentBidder}
              </p>
              <p className="text-xs text-muted-foreground">
                {domain.purchaseDate?.toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};