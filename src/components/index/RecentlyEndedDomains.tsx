import { Card } from "@/components/ui/card";
import { Domain } from "@/types/domain";

interface RecentlyEndedDomainsProps {
  domains: Domain[];
}

export const RecentlyEndedDomains = ({ domains }: RecentlyEndedDomainsProps) => {
  if (domains.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Recently Ended</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-4 bg-background border-border">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-foreground">{domain.name}</h3>
                <span className="text-primary font-medium">${domain.currentBid}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {domain.currentBidder 
                  ? `Final Bid: @${domain.currentBidder}`
                  : "Not sold"}
              </p>
              <p className="text-xs text-muted-foreground">
                Ended: {domain.endTime.toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};