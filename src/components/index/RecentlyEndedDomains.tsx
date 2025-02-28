import { Card } from "@/components/ui/card";
import { Domain } from "@/types/domain";

interface RecentlyEndedDomainsProps {
  domains: Domain[];
}

// Define the structure of the complex date object
interface ComplexDateObject {
  value: {
    iso: string;
  };
}

export const RecentlyEndedDomains = ({ domains }: RecentlyEndedDomainsProps) => {
  if (domains.length === 0) return null;

  const formatDate = (date: Date | string | ComplexDateObject | undefined) => {
    if (!date) return "N/A";
    try {
      // Handle the complex object structure from localStorage
      if (typeof date === 'object' && 'value' in date && typeof date.value === 'object' && 'iso' in date.value) {
        return new Date((date as ComplexDateObject).value.iso).toLocaleDateString();
      }
      // Handle regular Date objects or ISO strings
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj instanceof Date ? dateObj.toLocaleDateString() : "Invalid Date";
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Invalid Date";
    }
  };

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
                Ended: {formatDate(domain.endTime)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};