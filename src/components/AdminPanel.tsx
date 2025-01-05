import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Domain {
  id: number;
  name: string;
  currentBid: number;
  buyNowPrice?: number;
  status: 'pending' | 'active' | 'sold';
}

interface AdminPanelProps {
  pendingDomains: Domain[];
  onApproveDomain: (domainId: number) => void;
  onRejectDomain: (domainId: number) => void;
}

export const AdminPanel = ({ pendingDomains, onApproveDomain, onRejectDomain }: AdminPanelProps) => {
  const handleApprove = (domainId: number) => {
    onApproveDomain(domainId);
    toast.success("Domain approved successfully!");
  };

  const handleReject = (domainId: number) => {
    onRejectDomain(domainId);
    toast.success("Domain rejected successfully!");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel - Pending Domains</h2>
      {pendingDomains.length === 0 ? (
        <p className="text-gray-500">No pending domains to review</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingDomains.map((domain) => (
            <Card key={domain.id} className="p-4 backdrop-blur-sm bg-white/50">
              <div className="space-y-2">
                <h3 className="font-medium">{domain.name}</h3>
                <p className="text-sm text-gray-600">Starting Price: ${domain.currentBid}</p>
                {domain.buyNowPrice && (
                  <p className="text-sm text-gray-600">Buy Now Price: ${domain.buyNowPrice}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleApprove(domain.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(domain.id)}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};